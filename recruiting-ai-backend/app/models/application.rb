# frozen_string_literal: true

class Application < ApplicationRecord
  STATUSES = %w[applied screening shortlisted interview under_review offer hired rejected].freeze

  belongs_to :user, optional: true
  belongs_to :job
  belongs_to :candidate
  has_many :interviews, dependent: :destroy
  has_many :feedbacks, through: :interviews

  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :applied_at, presence: true
  validates :candidate_id, uniqueness: { scope: :job_id, message: "has already applied to this job" }

  default_scope { order(applied_at: :desc) }

  after_update :notify_candidate_of_status_change, if: :saved_change_to_status?

  private

  def notify_candidate_of_status_change
    CandidateNotificationJob.perform_later(id)
  end
end
