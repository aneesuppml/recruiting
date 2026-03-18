# frozen_string_literal: true

module CompanyScope
  extend ActiveSupport::Concern

  private

  def current_company
    return unless current_user

    active_company_id = request.headers["X-Company-ID"]&.to_s
    active_company_id = nil if active_company_id == ""

    if active_company_id
      # Prefer explicit company context from the client.
      return company_for_active_id(active_company_id)
    end

    if current_user.admin? && Company.column_names.include?("admin_user_id")
      Company.find_by(admin_user_id: current_user.id) || current_user.company
    else
      current_user.company
    end
  end

  def company_for_active_id(active_company_id)
    return Company.find_by(id: active_company_id) if current_user.super_admin?

    if current_user.admin?
      if Company.column_names.include?("admin_user_id")
        return Company.find_by(id: active_company_id, admin_user_id: current_user.id)
      end

      return if current_user.company_id.to_s != active_company_id.to_s
      Company.find_by(id: current_user.company_id)
    end

    # Non-admin users can only act within their single company context.
    return Company.find_by(id: active_company_id, id: current_user.company_id)
  end

  def ensure_company!
    render json: { error: "Company context required" }, status: :forbidden unless current_company
  end
end
