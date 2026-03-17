# frozen_string_literal: true

class JobCandidatesController < ApplicationController
  include Authenticatable
  include CompanyScope

  before_action :set_job
  before_action :authorize_job

  def top_candidates
    application_ids = @job.applications.pluck(:id)
    candidate_ids = Application.where(id: application_ids).pluck(:candidate_id).uniq
    candidates = Candidate.where(id: candidate_ids).with_resume_parsed.by_ai_score
    # Update scores for this job if not set
    candidates = candidates.map do |c|
      score = c.ai_match_score
      score = ResumeParserService.compute_match_score(c, @job) if score.blank?
      c.update_column(:ai_match_score, score) if score.present? && c.ai_match_score != score
      c.as_json.merge("ai_match_score" => score)
    end
    candidates.sort_by! { |h| -(h["ai_match_score"].to_f) }
    render json: { job_id: @job.id, candidates: candidates }
  end

  private

  def set_job
    @job = Job.find(params[:job_id])
  end

  def authorize_job
    ensure_company!
    render json: { error: "Forbidden" }, status: :forbidden unless @job.company_id == current_company.id
  end
end
