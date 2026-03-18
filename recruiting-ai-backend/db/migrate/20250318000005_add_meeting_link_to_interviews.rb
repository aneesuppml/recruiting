# frozen_string_literal: true

class AddMeetingLinkToInterviews < ActiveRecord::Migration[7.0]
  def change
    add_column :interviews, :meeting_link, :string
  end
end
