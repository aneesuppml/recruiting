# frozen_string_literal: true

class AuthController < ApplicationController
  def signup
    signup_attrs = signup_params

    company_name = signup_attrs.delete(:company_name)
    domain = signup_attrs.delete(:domain)
    company_size = signup_attrs.delete(:company_size)
    industry = signup_attrs.delete(:industry)
    address_line1 = signup_attrs.delete(:address_line1)
    address_line2 = signup_attrs.delete(:address_line2)
    city = signup_attrs.delete(:city)
    state = signup_attrs.delete(:state)
    country = signup_attrs.delete(:country)
    postal_code = signup_attrs.delete(:postal_code)
    contact_email = signup_attrs.delete(:contact_email)
    contact_phone = signup_attrs.delete(:contact_phone)

    company_attrs = {
      name: company_name,
      domain: domain,
      company_size: company_size,
      industry: industry,
      address_line1: address_line1,
      address_line2: address_line2,
      city: city,
      state: state,
      country: country,
      postal_code: postal_code,
      contact_email: contact_email,
      contact_phone: contact_phone,
      status: "pending",
      active: false,
    }

    # If you've modified an already-applied migration, the running DB may not yet
    # have the new columns. Filter to existing columns to avoid UnknownAttributeError.
    existing_columns = Company.column_names
    company_attrs = company_attrs.select { |k, _v| existing_columns.include?(k.to_s) }

    company = Company.new(company_attrs)

    unless company.save
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
      return
    end

    user = User.new(signup_attrs)
    user.company_id = company.id

    if user.save
      ensure_default_roles
      assign_admin_role(user)

      if Company.column_names.include?("admin_user_id") && company.admin_user_id.nil?
        company.update!(admin_user_id: user.id)
      end

      token = JwtService.encode({ user_id: user.id })
      render json: {
        user: user_json(user),
        token: token,
        pending: true,
        message: "Account Pending Approval"
      }, status: :created
    else
      company.destroy
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: login_params[:email])
    if user&.authenticate(login_params[:password])
      active_company =
        if Company.column_names.include?("admin_user_id") && user.admin?
          active_company = Company.find_by(id: user.company_id) if user.company_id.present?
          active_company ||= Company.find_by(admin_user_id: user.id)
          active_company
        else
          user.company
        end

      if active_company&.status == "rejected"
        render json: { error: "Account Rejected" }, status: :forbidden
        return
      end

      token = JwtService.encode({ user_id: user.id })
      render json: { user: user_json(user), token: token }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  private

  def signup_params
    params
      .require(:user)
      .permit(
        :name,
        :email,
        :password,
        :password_confirmation,
        # Admin user details
        :company_name,
        :domain,
        :company_size,
        :industry,
        # Company address/contact
        :address_line1,
        :address_line2,
        :city,
        :state,
        :country,
        :postal_code,
        :contact_email,
        :contact_phone
      )
  end

  def login_params
    params.require(:user).permit(:email, :password)
  end

  def user_json(user)
    active_company = nil

    if Company.column_names.include?("admin_user_id") && user.admin?
      # Prefer explicit single-company association if present.
      active_company = Company.find_by(id: user.company_id) if user.company_id.present?
      active_company ||= Company.find_by(admin_user_id: user.id)
    else
      active_company = user.company
    end

    {
      id: user.id,
      email: user.email,
      name: user.name,
      company_id: user.company_id,
      active_company_id: active_company&.id || user.company_id,
      roles: user.role_names,
      company_status: active_company&.status
    }
  end

  def ensure_default_roles
    %w[Super\ Admin Admin Recruiter Hiring\ Manager Interviewer].each do |name|
      Role.find_or_create_by!(name: name)
    end
  end

  def assign_admin_role(user)
    admin_role = Role.find_by!(name: "Admin")
    Membership.find_or_create_by!(user: user, role: admin_role)
  end
end
