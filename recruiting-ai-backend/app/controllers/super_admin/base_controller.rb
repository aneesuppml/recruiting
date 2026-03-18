# frozen_string_literal: true

module SuperAdmin
  class BaseController < ApplicationController
    include Authenticatable
    include Authorizable

    before_action :require_super_admin!
  end
end

