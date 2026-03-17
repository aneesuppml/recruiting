# frozen_string_literal: true

class ApplicationsController < ApplicationController
  include Authenticatable
  include CompanyScope

  before_action :set_application, only: %i[show update destroy]
  before_action :authorize_application, only: %i[show update destroy]

  def index
    scope = Application.joins(:job).where(jobs: { company_id: current_company.id })
    scope = scope.where(job_id: params[:job_id]) if params[:job_id].present?
    scope = scope.where(candidate_id: params[:candidate_id]) if params[:candidate_id].present?
    scope = scope.where(status: params[:status]) if params[:status].present?
    render json: scope
  end

  def show
    render json: @application
  end

  def create
    application = Application.new(application_params)
    application.user_id = current_user.id
    application.applied_at ||= Time.current
    if application.save
      render json: application, status: :created
    else
      render json: { errors: application.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @application.update(application_params)
      render json: @application
    else
      render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @application.destroy
    head :no_content
  end

  private

  def set_application
    @application = Application.find(params[:id])
  end

  def authorize_application
    ensure_company!
    job = @application.job
    render json: { error: "Forbidden" }, status: :forbidden unless job.company_id == current_company.id
  end

  def application_params
    params.require(:application).permit(:job_id, :candidate_id, :status, :applied_at)
  end
end
