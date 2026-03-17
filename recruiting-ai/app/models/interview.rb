# frozen_string_literal: true

class Interview < ApplicationRecord
  STATUSES = %w[scheduled completed cancelled no_show].freeze
  ROUND_TYPES = %w[phone screening technical behavioral hr final].freeze

  belongs_to :application
  belongs_to :interviewer, class_name: "User", optional: true
  has_many :feedbacks, dependent: :destroy

  validates :round_type, presence: true, inclusion: { in: ROUND_TYPES }
  validates :scheduled_at, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }
end
