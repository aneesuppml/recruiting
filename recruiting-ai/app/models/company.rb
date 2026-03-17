# frozen_string_literal: true

class Company < ApplicationRecord
  has_many :users, dependent: :nullify
  has_many :jobs, dependent: :destroy
  has_many :candidates, dependent: :destroy

  validates :name, presence: true
end
