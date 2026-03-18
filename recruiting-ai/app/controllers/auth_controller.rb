# frozen_string_literal: true

class AuthController < ApplicationController
  def signup
    user = User.new(signup_params)
    if user.save
      token = JwtService.encode({ user_id: user.id })
      render json: { user: user_json(user), token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: login_params[:email])
    if user&.authenticate(login_params[:password])
      token = JwtService.encode({ user_id: user.id })
      render json: { user: user_json(user), token: token }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  private

  def signup_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

  def login_params
    params.require(:user).permit(:email, :password)
  end

  def user_json(user)
    {
      id: user.id,
      email: user.email,
      name: user.name,
      company_id: user.company_id,
      roles: user.role_names
    }
  end
end
