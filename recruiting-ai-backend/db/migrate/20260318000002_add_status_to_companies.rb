# frozen_string_literal: true

class AddStatusToCompanies < ActiveRecord::Migration[7.2]
  def change
    # Tenant onboarding fields
    add_column :companies, :status, :string, null: false, default: "active"
    add_index :companies, :status

    add_column :companies, :company_size, :string
    add_column :companies, :industry, :string

    # Company identity/contact
    # `domain` already exists from earlier migrations; ensure uniqueness here.
    add_index :companies, :domain, unique: true

    add_column :companies, :address_line1, :string
    add_column :companies, :address_line2, :string
    add_column :companies, :city, :string
    add_column :companies, :state, :string
    add_column :companies, :country, :string
    add_column :companies, :postal_code, :string
    add_column :companies, :contact_email, :string
    add_column :companies, :contact_phone, :string
  end
end

