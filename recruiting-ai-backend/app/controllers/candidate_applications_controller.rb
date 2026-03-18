# frozen_string_literal: true

class CandidateApplicationsController < ApplicationController
  include CandidateAuthenticatable

  def index
    applications = current_candidate.applications
      .includes(job: :company)
      .unscope(:order)
      .order(applied_at: :desc)
    render json: applications.map { |a| candidate_application_json(a) }
  end

  def show
    application = current_candidate.applications.find(params[:id])
    render json: candidate_application_json(application, include_interview: true)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Not found" }, status: :not_found
  end

  def create
    application = Application.new(application_params)
    application.candidate_id = current_candidate.id
    application.user_id = nil
    application.applied_at = Time.current
    application.status = "applied"
    if application.save
      ApplicationProcessingJob.perform_later(application.id)
      render json: candidate_application_json(application), status: :created
    else
      render json: { errors: application.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def application_params
    params.require(:application).permit(:job_id, :resume_url, :cover_note)
  end

  def candidate_application_json(application, include_interview: false)
    j = application.job
    c = j.company
    h = {
      id: application.id,
      job_id: application.job_id,
      job_title: j.title,
      company_name: c&.name,
      company_id: c&.id,
      applied_at: application.applied_at,
      status: application.status,
      resume_url: application.resume_url,
      cover_note: application.cover_note,
      ai_score: application.ai_score
    }
    if include_interview
      interview = application.interviews.where(status: "scheduled").order(scheduled_at: :desc).first
      h[:interview] = interview ? {
        id: interview.id,
        round_type: interview.round_type,
        scheduled_at: interview.scheduled_at,
        meeting_link: interview.meeting_link,
        interviewer: interview.interviewer ? { id: interview.interviewer.id, name: interview.interviewer.name, email: interview.interviewer.email } : nil
      } : nil
    end
    h
  end
end
