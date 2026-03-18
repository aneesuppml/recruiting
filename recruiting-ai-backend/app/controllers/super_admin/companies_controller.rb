# frozen_string_literal: true

module SuperAdmin
  class CompaniesController < BaseController
    before_action :set_company, only: %i[update]

    def index
      companies = Company.order(created_at: :desc)

      admin_role = Role.find_by!(name: "Admin")
      admin_users = User.joins(:memberships)
                        .where(memberships: { role_id: admin_role.id })
                        .select(:id, :name, :email, :company_id)

      admin_by_company_id = admin_users.index_by(&:company_id)

      render json: companies.map do |company|
        admin_user = admin_by_company_id[company.id]

        company.as_json.merge(
          admin_user: admin_user ? { name: admin_user.name, email: admin_user.email } : nil
        )
      end
    end

    def create
      company_attrs = company_params
      company_attrs[:status] ||= company_attrs[:active] ? "active" : "pending"
      company_attrs[:active] = company_attrs[:status] == "active"
      existing_columns = Company.column_names
      company_attrs = company_attrs.select { |k, _v| existing_columns.include?(k.to_s) }

      company = Company.new(company_attrs)
      if company.save
        render json: company_json(company), status: :created
      else
        render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      company_attrs = company_params
      if company_attrs.key?(:status)
        company_attrs[:active] = company_attrs[:status] == "active"
      elsif company_attrs.key?(:active)
        # Preserve "pending" if the company is already pending and an update only
        # toggles `active` (e.g., editing name/domain without an approval decision).
        company_attrs[:status] =
          if company_attrs[:active]
            "active"
          else
            @company.status == "pending" ? "pending" : "rejected"
          end
      end

      existing_columns = Company.column_names
      company_attrs = company_attrs.select { |k, _v| existing_columns.include?(k.to_s) }

      if @company.update(company_attrs)
        render json: company_json(@company)
      else
        render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_company
      @company = Company.find(params[:id])
    end

    def company_json(company)
      admin_role = Role.find_by!(name: "Admin")
      admin_user = User.joins(:memberships)
                        .where(company_id: company.id, memberships: { role_id: admin_role.id })
                        .select(:name, :email)
                        .first

      company.as_json.merge(
        admin_user: admin_user ? { name: admin_user.name, email: admin_user.email } : nil
      )
    end

    def company_params
      params.require(:company).permit(
        :name,
        :domain,
        :active,
        :status,
        :company_size,
        :industry,
        :address_line1,
        :address_line2,
        :city,
        :state,
        :country,
        :postal_code,
        :contact_email,
        :contact_phone
      )
    end
  end
end

