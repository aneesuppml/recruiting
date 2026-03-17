# frozen_string_literal: true

class DashboardController < ApplicationController
  include Authenticatable
  include CompanyScope

  def summary
    ensure_company!
    company = current_company
    total_jobs = company.jobs.count
    active_jobs = company.jobs.active.count
    total_candidates = company.candidates.count
    total_applications = Application.joins(:job).where(jobs: { company_id: company.id }).count
    render json: {
      total_jobs: total_jobs,
      active_jobs: active_jobs,
      total_candidates: total_candidates,
      total_applications: total_applications
    }
  end

  def pipeline
    ensure_company!
    company = current_company
    by_status = Application
      .joins(:job)
      .where(jobs: { company_id: company.id })
      .unscope(:order)
      .group(:status)
      .count
    render json: { pipeline: by_status }
  end

  def reports
    ensure_company!
    company = current_company
    total_interviews = Interview.joins(application: :job).where(jobs: { company_id: company.id }).count
    completed_interviews = Interview.joins(application: :job).where(jobs: { company_id: company.id }, status: "completed").count
    hired = Application.joins(:job).where(jobs: { company_id: company.id }, status: "hired").count
    conversion = total_interviews.positive? ? ((completed_interviews.to_f / total_interviews) * 100).round(2) : 0
    hiring_rate = company.candidates.count.positive? ? ((hired.to_f / company.candidates.count) * 100).round(2) : 0
    render json: {
      total_interviews: total_interviews,
      completed_interviews: completed_interviews,
      interview_conversion_rate: conversion,
      hired_count: hired,
      hiring_rate: hiring_rate
    }
  end
end
