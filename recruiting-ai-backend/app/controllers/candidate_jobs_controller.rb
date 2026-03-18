# frozen_string_literal: true

class CandidateJobsController < ApplicationController
  include CandidateAuthenticatable

  def index
    jobs = Job.active.includes(:company).reorder(created_at: :desc)

    # Scope by candidate company when available.
    if current_candidate.company_id.present?
      jobs = jobs.where(company_id: current_candidate.company_id)
    end

    jobs = jobs.where("title ILIKE ?", "%#{params[:title]}%") if params[:title].present?
    jobs = jobs.where("location ILIKE ?", "%#{params[:location]}%") if params[:location].present?
    jobs = jobs.where("? = ANY(required_skills)", params[:skills]) if params[:skills].present?
    jobs = jobs.where(experience_level: params[:experience_level]) if params[:experience_level].present?

    render json: jobs.map { |j| candidate_job_json(j) }
  end

  def show
    job = Job.active.includes(:company).find(params[:id])

    if current_candidate.company_id.present? && job.company_id != current_candidate.company_id
      render json: { error: "Not found" }, status: :not_found
      return
    end

    render json: candidate_job_json(job, include_company: true)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Not found" }, status: :not_found
  end

  private

  def candidate_job_json(job, include_company: false)
    h = {
      id: job.id,
      title: job.title,
      description: job.description,
      department: job.department,
      location: job.location,
      status: job.status,
      experience_level: job.experience_level,
      required_skills: job.required_skills || [],
    }

    if include_company && job.company
      h[:company] = { id: job.company.id, name: job.company.name, domain: job.company.domain }
    end

    h
  end
end

