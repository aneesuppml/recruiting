# frozen_string_literal: true

class FeedbacksController < ApplicationController
  include Authenticatable
  include CompanyScope

  before_action :set_feedback, only: %i[show update destroy]
  before_action :authorize_feedback, only: %i[show update destroy]

  def index
    interview = Interview.joins(application: :job).find_by!(id: params[:interview_id], jobs: { company_id: current_company.id })
    feedbacks = interview.feedbacks
    render json: feedbacks
  end

  def show
    render json: @feedback
  end

  def create
    feedback = Feedback.new(feedback_params)
    if feedback.save
      render json: feedback, status: :created
    else
      render json: { errors: feedback.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @feedback.update(feedback_params)
      render json: @feedback
    else
      render json: { errors: @feedback.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @feedback.destroy
    head :no_content
  end

  private

  def set_feedback
    @feedback = Feedback.find(params[:id])
  end

  def authorize_feedback
    ensure_company!
    job = @feedback.interview.application.job
    render json: { error: "Forbidden" }, status: :forbidden unless job.company_id == current_company.id
  end

  def feedback_params
    params.require(:feedback).permit(:interview_id, :rating, :strengths, :weaknesses, :recommendation)
  end
end
