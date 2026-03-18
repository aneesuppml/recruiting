# frozen_string_literal: true

class CreateJobs < ActiveRecord::Migration[7.2]
  def change
    create_table :jobs do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :status, null: false, default: "draft"
      t.string :department
      t.string :location
      t.references :company, null: false, foreign_key: true
      t.references :created_by, null: true, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
