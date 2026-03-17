# frozen_string_literal: true

class CreateApplications < ActiveRecord::Migration[7.2]
  def change
    create_table :applications do |t|
      t.references :user, null: true, foreign_key: true
      t.references :job, null: false, foreign_key: true
      t.references :candidate, null: false, foreign_key: true
      t.string :status, null: false, default: "applied"
      t.datetime :applied_at, null: false

      t.timestamps
    end

    add_index :applications, %i[job_id candidate_id], unique: true
  end
end
