# frozen_string_literal: true

class CandidatesController < ApplicationController
  include Authenticatable
  include CompanyScope
  include Authorizable

  before_action :set_candidate, only: %i[show update destroy]
  before_action :authorize_candidate, only: %i[show update destroy]
  before_action :require_can_view_candidates!, only: %i[index show]
  before_action :require_can_manage_candidates!, only: %i[create update destroy]

  def index
    candidates = current_company.candidates
    candidates = candidates.where(status: params[:status]) if params[:status].present?
    render json: candidates
  end

  def show
    render json: @candidate
  end

  def create
    candidate = current_company.candidates.build(candidate_params)
    if candidate.save
      render json: candidate, status: :created
    else
      render json: { errors: candidate.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @candidate.update(candidate_params)
      render json: @candidate
    else
      render json: { errors: @candidate.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @candidate.destroy
    head :no_content
  end

  private

  def set_candidate
    @candidate = Candidate.find(params[:id])
  end

  def authorize_candidate
    ensure_company!
    render json: { error: "Forbidden" }, status: :forbidden unless @candidate.company_id == current_company.id
  end

  def candidate_params
    params.require(:candidate).permit(:name, :email, :phone, :resume_url, :linkedin_url, :status)
  end
end
