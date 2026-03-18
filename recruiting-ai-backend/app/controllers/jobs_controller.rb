# frozen_string_literal: true

class JobsController < ApplicationController
  include Authenticatable
  include CompanyScope
  include Authorizable

  before_action :set_job, only: %i[show update destroy]
  before_action :authorize_job, only: %i[show update destroy]
  before_action :require_can_view_jobs!, only: %i[index show]
  before_action :require_can_manage_jobs!, only: %i[create update destroy]

  def index
    jobs = current_company.jobs
    jobs = jobs.where(status: params[:status]) if params[:status].present?
    render json: jobs
  end

  def show
    render json: @job
  end

  def create
    job = current_company.jobs.build(job_params)
    job.created_by_id = current_user.id
    if job.save
      render json: job, status: :created
    else
      render json: { errors: job.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @job.update(job_params)
      render json: @job
    else
      render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @job.destroy
    head :no_content
  end

  private

  def set_job
    @job = Job.find(params[:id])
  end

  def authorize_job
    ensure_company!
    render json: { error: "Forbidden" }, status: :forbidden unless @job.company_id == current_company.id
  end

  def job_params
    params.require(:job).permit(:title, :description, :status, :department, :location, :experience_level, :required_skills => [])
  end
end
