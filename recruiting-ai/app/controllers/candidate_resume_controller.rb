# frozen_string_literal: true

class CandidateResumeController < ApplicationController
  include Authenticatable
  include CompanyScope
  include Authorizable

  before_action :set_candidate
  before_action :authorize_candidate
  before_action :require_can_manage_candidates!

  def parse_resume
    text = ResumeParserService.extract_text(params[:resume_text] || @candidate.resume_url || @candidate.resume_text)
    skills = ResumeParserService.extract_skills(text)
    @candidate.update!(resume_text: text, skills: skills)
    render json: { candidate: @candidate, skills: skills }
  end

  private

  def set_candidate
    @candidate = Candidate.find(params[:candidate_id])
  end

  def authorize_candidate
    ensure_company!
    render json: { error: "Forbidden" }, status: :forbidden unless @candidate.company_id == current_company.id
  end
end
