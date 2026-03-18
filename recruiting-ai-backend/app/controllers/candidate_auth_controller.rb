# frozen_string_literal: true

class CandidateAuthController < ApplicationController
  def signup
    candidate = Candidate.new(candidate_signup_params)
    candidate.company_id = nil
    candidate.status = "new"
    if candidate.save
      token = JwtService.encode({ candidate_id: candidate.id })
      render json: { candidate: candidate_json(candidate), token: token }, status: :created
    else
      render json: { errors: candidate.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    candidate = Candidate.find_by(email: params[:candidate][:email], company_id: nil)
    if candidate&.authenticate(params[:candidate][:password])
      token = JwtService.encode({ candidate_id: candidate.id })
      render json: { candidate: candidate_json(candidate), token: token }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  private

  def candidate_signup_params
    params.require(:candidate).permit(:name, :email, :phone, :password, :password_confirmation, :location, :skills => [])
  end

  def candidate_json(c)
    {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      location: c.location,
      skills: c.skills || []
    }
  end
end
