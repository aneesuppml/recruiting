# frozen_string_literal: true

class AddJobBoardFieldsToJobs < ActiveRecord::Migration[7.0]
  def change
    add_column :jobs, :experience_level, :string
    add_column :jobs, :required_skills, :string, array: true, default: []
  end
end
