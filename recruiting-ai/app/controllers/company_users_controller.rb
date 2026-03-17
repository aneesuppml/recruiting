# frozen_string_literal: true

class CompanyUsersController < ApplicationController
  include Authenticatable
  include CompanyScope

  before_action :set_company
  before_action :authorize_company

  def index
    users = @company.users
    render json: users.map { |u| user_json(u) }
  end

  def create
    user = @company.users.build(user_params)
    if user.save
      assign_role(user, params[:role])
      render json: user_json(user), status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_company
    @company = Company.find(params[:company_id])
  end

  def authorize_company
    render json: { error: "Forbidden" }, status: :forbidden unless current_user.company_id == @company.id && (current_user.admin? || current_user.recruiter?)
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

  def assign_role(user, role_name)
    return unless role_name.present?
    role = Role.find_by(name: role_name)
    Membership.create!(user: user, role: role) if role && %w[Admin Recruiter Interviewer].include?(role_name)
  end

  def user_json(user)
    {
      id: user.id,
      email: user.email,
      company_id: user.company_id,
      roles: user.roles.pluck(:name)
    }
  end
end
