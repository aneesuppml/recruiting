# frozen_string_literal: true

class Application < ApplicationRecord
  STATUSES = %w[applied screening interview offer hired rejected].freeze

  belongs_to :user, optional: true
  belongs_to :job
  belongs_to :candidate
  has_many :interviews, dependent: :destroy
  has_many :feedbacks, through: :interviews

  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :applied_at, presence: true
  validates :candidate_id, uniqueness: { scope: :job_id, message: "has already applied to this job" }

  default_scope { order(applied_at: :desc) }
end
