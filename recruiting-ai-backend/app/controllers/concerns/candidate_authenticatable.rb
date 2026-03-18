# frozen_string_literal: true

module CandidateAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_candidate_request
  end

  private

  def authenticate_candidate_request
    token = request.headers["Authorization"]&.split(" ")&.last
    payload = JwtService.decode(token)
    if payload && payload[:candidate_id]
      @current_candidate = Candidate.find_by(id: payload[:candidate_id])
    end
    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_candidate
  end

  def current_candidate
    @current_candidate
  end
end
