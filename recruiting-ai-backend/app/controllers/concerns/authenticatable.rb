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

    return if !@current_user.company

    # Pending tenant users can sign in, but must not access restricted resources.
    # Allow only profile and company status endpoints while pending/rejected.
    if %w[pending rejected].include?(@current_user.company.status)
      allowed_paths = ["/profile", "/company/status"]
      return if request.method == "OPTIONS"
      return render(json: { error: "Company Pending Approval" }, status: :forbidden) unless allowed_paths.include?(request.path)
    end
  end

  def current_user
    @current_user
  end
end
