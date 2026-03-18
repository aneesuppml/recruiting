# frozen_string_literal: true

class CompaniesController < ApplicationController
  include Authenticatable
  include CompanyScope
  include Authorizable

  before_action :set_company, only: %i[show update]
  before_action :authorize_company, only: %i[show update]
  before_action :require_can_view_companies!, only: %i[index show]
  before_action :require_can_create_company!, only: %i[create]
  before_action :require_can_update_company!, only: %i[update]

  def status
    company = current_user.company
    unless company
      render json: { error: "Company context required" }, status: :forbidden
      return
    end

    render json: {
      company: company.as_json(
        only: [
          :id,
          :name,
          :domain,
          :company_size,
          :industry,
          :address_line1,
          :address_line2,
          :city,
          :state,
          :country,
          :postal_code,
          :contact_email,
          :contact_phone,
          :status,
          :active,
          :created_at,
          :updated_at
        ]
      ),
      admin_user: { name: current_user.name, email: current_user.email }
    }
  end

  def index
    companies = current_user.super_admin? ? Company.all : (current_user.admin? ? Company.all : Company.where(id: current_user.company_id))
    render json: companies
  end

  def show
    render json: @company
  end

  def create
    company = Company.new(company_params)
    if company.save
      ensure_default_roles
      unless current_user.super_admin?
        current_user.update!(company_id: company.id)
        assign_admin_role(current_user)
      end
      render json: company, status: :created
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @company.update(company_params)
      render json: @company
    else
      render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_company
    @company = Company.find(params[:id])
  end

  def authorize_company
    return if current_user.admin?
    render json: { error: "Forbidden" }, status: :forbidden unless current_user.company_id == @company.id
  end

  def company_params
    permitted = %i[name domain]
    permitted << :active if current_user.super_admin?
    params.require(:company).permit(permitted)
  end

  def ensure_default_roles
    %w[Super Admin Admin Recruiter Hiring Manager Interviewer].each do |name|
      Role.find_or_create_by!(name: name)
    end
  end

  def assign_admin_role(user)
    admin_role = Role.find_by!(name: "Admin")
    Membership.find_or_create_by!(user: user, role: admin_role)
  end
end
