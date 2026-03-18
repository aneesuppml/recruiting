# frozen_string_literal: true

class Candidate < ApplicationRecord
  has_secure_password validations: false

  belongs_to :company, optional: true
  has_many :applications, dependent: :destroy
  has_many :jobs, through: :applications

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email, uniqueness: { case_sensitive: false, conditions: -> { where(company_id: nil) } }, if: -> { company_id.nil? }
  validates :status, presence: true
  validates :password, presence: true, on: :create, if: -> { company_id.nil? }
  validates :password, length: { minimum: 6 }, confirmation: true, if: -> { password.present? }

  scope :external, -> { where(company_id: nil) }
  scope :with_resume_parsed, -> { where.not(resume_text: [nil, ""]) }
  scope :by_ai_score, -> { order(ai_match_score: :desc) }
end
