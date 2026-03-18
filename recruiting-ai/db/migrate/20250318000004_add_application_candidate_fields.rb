# frozen_string_literal: true

class AddApplicationCandidateFields < ActiveRecord::Migration[7.0]
  def change
    add_column :applications, :resume_url, :string
    add_column :applications, :cover_note, :text
    add_column :applications, :ai_score, :decimal, precision: 5, scale: 2
    add_column :applications, :parsed_skills, :string, array: true, default: []
  end
end
