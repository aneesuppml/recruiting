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
    company = current_company
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
      admin_user: {
        name: company.admin_user&.name || current_user.name,
        email: company.admin_user&.email || current_user.email
      }
    }
  end

  def index
    if current_user.super_admin?
      render json: Company.all
      return
    end

    if current_user.admin? && Company.column_names.include?("admin_user_id")
      render json: Company.where(admin_user_id: current_user.id)
      return
    end

    render json: Company.where(id: current_user.company_id)
  end

  def show
    render json: @company
  end

  def create
    attrs = company_params
    company_name = attrs.delete(:company_name) || attrs.delete(:name)

    # Ownership enforcement:
    # The currently authenticated user must be the company admin.
    # Reject any attempt to assign a different admin during creation.
    attempted_admin_id =
      params.dig(:company, :admin_id) ||
      params.dig(:company, :owner_id) ||
      params.dig(:company, :admin_user_id)

    if attempted_admin_id.present? && attempted_admin_id.to_i != current_user.id
      render json: { error: "Forbidden: only the logged-in admin can be assigned" }, status: :forbidden
      return
    end

    # If you've modified an already-applied migration, the running DB may not
    # yet have the new columns. Filter to existing columns to avoid
    # UnknownAttributeError during Company.new.
    existing_columns = Company.column_names

    company_attrs =
      attrs
        .merge(
          name: company_name,
          admin_user_id: current_user.id,
          status: "pending",
          active: false
        )
        .select { |k, _v| existing_columns.include?(k.to_s) }

    company = Company.new(company_attrs)
    if company.save
      ensure_default_roles
      assign_admin_role(current_user)

      render json: {
        company: company,
        user: user_json_for_active_company(current_user, company),
        pending: true,
        message: "Account Pending Approval"
      }, status: :created
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    existing_columns = Company.column_names
    update_attrs = company_params.select { |k, _v| existing_columns.include?(k.to_s) }

    if @company.update(update_attrs)
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
    return if current_user.super_admin?

    if current_user.admin? && Company.column_names.include?("admin_user_id")
      return if @company.admin_user_id == current_user.id
    end

    return if current_user.company_id == @company.id

    render json: { error: "Forbidden" }, status: :forbidden
  end

  def company_params
    permitted = [
      # company identity
      :company_name,
      :name,
      :domain,
      :company_size,
      :industry,
      # address
      :address_line1,
      :address_line2,
      :city,
      :state,
      :country,
      :postal_code,
      # contact
      :contact_email,
      :contact_phone
    ]

    if current_user.super_admin?
      permitted.concat([:active, :status])
    end

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

  def user_json(user)
    {
      id: user.id,
      email: user.email,
      name: user.name,
      company_id: user.company_id,
      roles: user.role_names,
      company_status: user.company&.status
    }
  end

  def user_json_for_active_company(user, company)
    {
      id: user.id,
      email: user.email,
      name: user.name,
      company_id: user.company_id,
      active_company_id: company.id,
      roles: user.role_names,
      company_status: company.status
    }
  end
end
