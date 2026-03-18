# frozen_string_literal: true

module SuperAdmin
  class UsersController < BaseController
    def index
      users = User.includes(:company, :roles).order(created_at: :desc)
      render json: users.map { |u| user_json(u) }
    end

    private

    def user_json(user)
      {
        id: user.id,
        email: user.email,
        name: user.name,
        company_id: user.company_id,
        company_name: user.company&.name,
        roles: user.roles.pluck(:name)
      }
    end
  end
end

