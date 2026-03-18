# frozen_string_literal: true

class Job < ApplicationRecord
  STATUSES = %w[draft published closed].freeze

  belongs_to :company
  belongs_to :created_by, class_name: "User", optional: true
  has_many :applications, dependent: :destroy
  has_many :candidates, through: :applications
  has_many :interviews, through: :applications

  validates :title, presence: true
  validates :description, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :department, presence: true
  validates :location, presence: true

  scope :active, -> { where(status: "published") }
  scope :draft, -> { where(status: "draft") }
  scope :closed, -> { where(status: "closed") }
end
