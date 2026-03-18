# frozen_string_literal: true

class CreateInterviews < ActiveRecord::Migration[7.2]
  def change
    create_table :interviews do |t|
      t.references :application, null: false, foreign_key: true
      t.string :round_type, null: false
      t.references :interviewer, null: true, foreign_key: { to_table: :users }
      t.datetime :scheduled_at, null: false
      t.string :status, null: false, default: "scheduled"

      t.timestamps
    end
  end
end
