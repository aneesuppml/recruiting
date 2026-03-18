# frozen_string_literal: true

module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  private

  def authenticate_request
    token = request.headers["Authorization"]&.split(" ")&.last
    payload = JwtService.decode(token)
    if payload && payload[:user_id]
      @current_user = User.find_by(id: payload[:user_id])
    end

    return render(json: { error: "Unauthorized" }, status: :unauthorized) unless @current_user

    active_company_id = request.headers["X-Company-ID"]&.to_s
    active_company_id = nil if active_company_id == ""

    target_company =
      if active_company_id
        Company.find_by(id: active_company_id)
      else
        if @current_user.admin? && Company.column_names.include?("admin_user_id")
          Company.find_by(admin_user_id: @current_user.id)
        else
          @current_user.company
        end
      end

    # If the active company context isn't present/accessible, fall back to the user's company association.
    if !target_company && @current_user.company
      target_company = @current_user.company
    end

    return if !target_company

    # Enforce that the active company context is accessible to this user.
    unless current_user_can_access_company?(target_company)
      return render(json: { error: "Forbidden" }, status: :forbidden)
    end

    # Pending tenant users can sign in, but must not access restricted resources.
    # Allow only profile and company status endpoints while pending/rejected.
    if %w[pending rejected].include?(target_company.status)
      return if request.method == "OPTIONS"

      allowed =
        if request.path == "/companies"
          request.request_method == "GET"
        elsif request.path == "/profile"
          %w[GET PATCH].include?(request.request_method)
        elsif request.path == "/company/status"
          request.request_method == "GET"
        else
          false
        end

      return render(json: { error: "Company Pending Approval" }, status: :forbidden) unless allowed
    end
  end

  def current_user_can_access_company?(company)
    return true if @current_user.super_admin?

    if @current_user.admin?
      if Company.column_names.include?("admin_user_id")
        return company.admin_user_id == @current_user.id
      end
      return company.id == @current_user.company_id
    end

    company.id == @current_user.company_id
  end

  def current_user
    @current_user
  end
end
