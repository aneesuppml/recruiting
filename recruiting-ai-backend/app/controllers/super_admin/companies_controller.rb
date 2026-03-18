# frozen_string_literal: true

module SuperAdmin
  class CompaniesController < BaseController
    before_action :set_company, only: %i[update]

    def index
      render json: Company.order(created_at: :desc)
    end

    def create
      company = Company.new(company_params)
      if company.save
        render json: company, status: :created
      else
        render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @company.update(company_params)
        render json: @company
      else
        render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_company
      @company = Company.find(params[:id])
    end

    def company_params
      params.require(:company).permit(:name, :domain, :active)
    end
  end
end

