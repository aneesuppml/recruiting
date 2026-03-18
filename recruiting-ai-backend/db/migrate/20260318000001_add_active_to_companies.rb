# frozen_string_literal: true

class AddActiveToCompanies < ActiveRecord::Migration[7.2]
  def change
    add_column :companies, :active, :boolean, null: false, default: true
    add_index :companies, :active
  end
end

