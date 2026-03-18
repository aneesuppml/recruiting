# frozen_string_literal: true

class CandidateMailer < ApplicationMailer
  def application_status_changed(application)
    @application = application
    @candidate = application.candidate
    @job = application.job
    @status = application.status
    mail(
      to: @candidate.email,
      subject: "Application update: #{@job.title} - #{@status}"
    )
  end
end
