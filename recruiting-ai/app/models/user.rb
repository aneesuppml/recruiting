# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  belongs_to :company, optional: true
  has_many :memberships, dependent: :destroy
  has_many :roles, through: :memberships
  has_many :jobs_created, class_name: "Job", foreign_key: :created_by_id, dependent: :nullify
  has_many :applications, dependent: :nullify
  has_many :interviews_as_interviewer, class_name: "Interview", foreign_key: :interviewer_id, dependent: :nullify

  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: false

  def admin?
    roles.exists?(name: "Admin")
  end

  def recruiter?
    roles.exists?(name: "Recruiter")
  end

  def interviewer?
    roles.exists?(name: "Interviewer")
  end
end
