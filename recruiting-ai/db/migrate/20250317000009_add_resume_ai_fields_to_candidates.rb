# frozen_string_literal: true

class AddResumeAiFieldsToCandidates < ActiveRecord::Migration[7.2]
  def change
    add_column :candidates, :resume_text, :text
    add_column :candidates, :skills, :string, array: true, default: []
    add_column :candidates, :ai_match_score, :decimal, precision: 5, scale: 2
  end
end
