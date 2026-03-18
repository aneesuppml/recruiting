# frozen_string_literal: true

class InterviewsController < ApplicationController
  include Authenticatable
  include CompanyScope
  include Authorizable

  before_action :set_interview, only: %i[show update destroy]
  before_action :authorize_interview, only: %i[show update destroy]
  before_action :require_can_view_interviews!, only: %i[index show]
  before_action :require_can_manage_interviews!, only: %i[create update destroy]
  before_action :require_interviewer_assigned_for_show!, only: %i[show]

  def index
    scope = Interview.joins(application: :job).where(jobs: { company_id: current_company.id })
    scope = scope.where(application_id: params[:application_id]) if params[:application_id].present?
    if current_user.interviewer? && !current_user.admin? && !current_user.recruiter? && !current_user.hiring_manager?
      scope = scope.where(interviewer_id: current_user.id)
    else
      scope = scope.where(interviewer_id: current_user.id) if params[:mine].present?
    end
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

  def require_interviewer_assigned_for_show!
    require_interviewer_assigned_to!(@interview)
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
