# frozen_string_literal: true

module SuperAdmin
  class AnalyticsController < BaseController
    def summary
      render json: {
        total_companies: Company.count,
        active_companies: Company.where(active: true).count,
        total_users: User.count,
        total_jobs: Job.count,
        total_candidates: Candidate.count,
        total_applications: Application.count,
        total_interviews: Interview.count
      }
    end
  end
end

