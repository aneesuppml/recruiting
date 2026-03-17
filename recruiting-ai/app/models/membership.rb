# frozen_string_literal: true

class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :role

  validates :user_id, uniqueness: { scope: :role_id }
end
