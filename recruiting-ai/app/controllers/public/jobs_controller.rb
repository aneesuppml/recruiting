# frozen_string_literal: true

module Public
  class JobsController < ApplicationController
    def index
      jobs = Job.active.includes(:company).reorder(created_at: :desc)
      jobs = jobs.where("title ILIKE ?", "%#{params[:title]}%") if params[:title].present?
      jobs = jobs.where("location ILIKE ?", "%#{params[:location]}%") if params[:location].present?
      jobs = jobs.where("? = ANY(required_skills)", params[:skills]) if params[:skills].present?
      jobs = jobs.where(experience_level: params[:experience_level]) if params[:experience_level].present?
      render json: jobs.map { |j| public_job_json(j) }
    end

    def show
      job = Job.active.find(params[:id])
      render json: public_job_json(job, include_company: true)
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Not found" }, status: :not_found
    end

    private

    def public_job_json(job, include_company: false)
      h = {
        id: job.id,
        title: job.title,
        description: job.description,
        department: job.department,
        location: job.location,
        status: job.status,
        experience_level: job.experience_level,
        required_skills: job.required_skills || []
      }
      h[:company] = { id: job.company.id, name: job.company.name, domain: job.company.domain } if include_company && job.company
      h
    end
  end
end
