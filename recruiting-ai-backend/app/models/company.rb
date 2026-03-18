# frozen_string_literal: true

class Company < ApplicationRecord
  belongs_to :admin_user, class_name: "User", optional: true

  has_many :users, dependent: :nullify
  has_many :jobs, dependent: :destroy
  has_many :candidates, dependent: :destroy

  validates :name, presence: true
  validates :domain, presence: true, uniqueness: true
  validates :status, presence: true, inclusion: { in: %w[pending active rejected] }
end
