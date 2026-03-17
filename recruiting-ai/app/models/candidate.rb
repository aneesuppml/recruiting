# frozen_string_literal: true

class Candidate < ApplicationRecord
  belongs_to :company
  has_many :applications, dependent: :destroy
  has_many :jobs, through: :applications

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, presence: true

  scope :with_resume_parsed, -> { where.not(resume_text: [nil, ""]) }
  scope :by_ai_score, -> { order(ai_match_score: :desc) }
end
