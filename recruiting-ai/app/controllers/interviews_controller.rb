# frozen_string_literal: true

class InterviewsController < ApplicationController
  include Authenticatable
  include CompanyScope

  before_action :set_interview, only: %i[show update destroy]
  before_action :authorize_interview, only: %i[show update destroy]

  def index
    scope = Interview.joins(application: :job).where(jobs: { company_id: current_company.id })
    scope = scope.where(application_id: params[:application_id]) if params[:application_id].present?
    scope = scope.where(interviewer_id: current_user.id) if params[:mine].present?
    render json: scope
  end

  def show
    render json: @interview
  end

  def create
    interview = Interview.new(interview_params)
    if interview.save
      render json: interview, status: :created
    else
      render json: { errors: interview.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @interview.update(interview_params)
      render json: @interview
    else
      render json: { errors: @interview.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @interview.destroy
    head :no_content
  end

  private

  def set_interview
    @interview = Interview.find(params[:id])
  end

  def authorize_interview
    ensure_company!
    job = @interview.application.job
    render json: { error: "Forbidden" }, status: :forbidden unless job.company_id == current_company.id
  end

  def interview_params
    params.require(:interview).permit(:application_id, :round_type, :interviewer_id, :scheduled_at, :status)
  end
end
