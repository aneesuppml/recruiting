# frozen_string_literal: true

class Feedback < ApplicationRecord
  RECOMMENDATIONS = %w[strong_hire hire no_hire strong_no_hire].freeze

  belongs_to :interview

  validates :rating, presence: true, numericality: { only_integer: true, in: 1..5 }
  validates :recommendation, presence: true, inclusion: { in: RECOMMENDATIONS }
end
