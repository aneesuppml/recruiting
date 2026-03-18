# frozen_string_literal: true

class CreateFeedbacks < ActiveRecord::Migration[7.2]
  def change
    create_table :feedbacks do |t|
      t.references :interview, null: false, foreign_key: true
      t.integer :rating, null: false
      t.text :strengths
      t.text :weaknesses
      t.string :recommendation, null: false

      t.timestamps
    end
  end
end
