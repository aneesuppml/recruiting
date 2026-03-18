# frozen_string_literal: true

module CompanyScope
  extend ActiveSupport::Concern

  private

  def current_company
    current_user&.company
  end

  def ensure_company!
    render json: { error: "Company context required" }, status: :forbidden unless current_company
  end
end
