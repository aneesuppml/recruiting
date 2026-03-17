# frozen_string_literal: true

class CreateMemberships < ActiveRecord::Migration[7.2]
  def change
    create_table :memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :role, null: false, foreign_key: true

      t.timestamps
    end

    add_index :memberships, %i[user_id role_id], unique: true
  end
end
