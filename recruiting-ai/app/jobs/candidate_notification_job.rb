# frozen_string_literal: true

class CandidateNotificationJob < ApplicationJob
  queue_as :default

  def perform(application_id)
    application = Application.find_by(id: application_id)
    return unless application

    CandidateMailer.application_status_changed(application).deliver_now
  end
end
