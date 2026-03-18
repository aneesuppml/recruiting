# frozen_string_literal: true

class ApplicationProcessingJob < ApplicationJob
  queue_as :default

  def perform(application_id)
    application = Application.find_by(id: application_id)
    return unless application

    candidate = application.candidate
    job = application.job
    resume_input = application.resume_url.presence || candidate.resume_url.presence || candidate.resume_text

    if resume_input.present?
      text = ResumeParserService.extract_text(resume_input)
      skills = ResumeParserService.extract_skills(text)
      candidate.update_columns(resume_text: text, skills: skills) # skip validations if needed
      score = ResumeParserService.compute_match_score(candidate, job)
      application.update_columns(ai_score: score, parsed_skills: skills)
    end
  end
end
