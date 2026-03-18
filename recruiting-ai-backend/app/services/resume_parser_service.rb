# frozen_string_literal: true

class ResumeParserService
  class << self
    def extract_text(resume_url_or_text)
      return resume_url_or_text if resume_url_or_text.to_s.length > 100
      # Placeholder: in production, fetch URL and use a PDF/text extraction gem or external API
      # For now we treat input as raw text if it looks like inline content
      resume_url_or_text.to_s
    end

    def extract_skills(text)
      # Placeholder: in production, use NLP or an AI API to extract skills
      # Simple keyword extraction for demo
      return [] if text.blank?
      words = text.downcase.scan(/\b[a-z]{3,}\b/)
      words.uniq.first(30)
    end

    def compute_match_score(candidate, job)
      return nil unless candidate.resume_text.present? && job.description.present?
      job_words = job.description.downcase.scan(/\b[a-z]{3,}\b/).uniq
      candidate_skills = (candidate.skills || []).map(&:downcase)
      return 0.0 if job_words.empty?
      overlap = (job_words & candidate_skills).size.to_f
      ((overlap / job_words.size) * 100).round(2)
    end
  end
end
