# frozen_string_literal: true

class ProfilesController < ApplicationController
  include Authenticatable

  def show
    render json: profile_json(current_user)
  end

  def update
    if update_password? && !current_user.authenticate(params[:user][:current_password])
      render json: { error: "Current password is incorrect" }, status: :unprocessable_entity
      return
    end

    if current_user.update(profile_params)
      render json: profile_json(current_user)
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    permitted = %i[name email]
    permitted.concat(%i[password password_confirmation]) if update_password?
    params.require(:user).permit(permitted)
  end

  def update_password?
    params[:user][:password].present?
  end

  def profile_json(user)
    {
      id: user.id,
      email: user.email,
      name: user.name,
      company_id: user.company_id,
      company_name: user.company&.name,
      roles: user.roles.pluck(:name)
    }
  end
end
