# frozen_string_literal: true

class CompaniesController < ApplicationController
  include Authenticatable
  include CompanyScope

  before_action :set_company, only: %i[show update]
  before_action :authorize_company, only: %i[show update]

  def index
    companies = current_user.admin? ? Company.all : Company.where(id: current_user.company_id)
    render json: companies
  end

  def show
    render json: @company
  end

  def create
    company = Company.new(company_params)
    if company.save
      current_user.update!(company_id: company.id)
      ensure_default_roles
      assign_admin_role(current_user)
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
    params.require(:company).permit(:name, :domain)
  end

  def ensure_default_roles
    %w[Admin Recruiter Interviewer].each do |name|
      Role.find_or_create_by!(name: name)
    end
  end

  def assign_admin_role(user)
    admin_role = Role.find_by!(name: "Admin")
    Membership.find_or_create_by!(user: user, role: admin_role)
  end
end
