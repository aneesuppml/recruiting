# frozen_string_literal: true

class CreateCompanies < ActiveRecord::Migration[7.2]
  def change
    create_table :companies do |t|
      t.string :name, null: false
      t.string :domain

      t.timestamps
    end
  end
end
