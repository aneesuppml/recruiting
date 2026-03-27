# frozen_string_literal: true

class JwtService
  DEFAULT_EXPIRATION = 24.hours.from_now

  class << self
    def encode(payload, exp: DEFAULT_EXPIRATION)
      payload = payload.dup
      payload[:exp] = exp.to_i
      JWT.encode(payload, secret)
    end

    def decode(token)
      body = JWT.decode(token, secret).first
      ActiveSupport::HashWithIndifferentAccess.new(body)
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end

    private

    def secret
      Rails.application.secret_key_base
    end
  end
end
