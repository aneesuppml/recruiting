# frozen_string_literal: true

class CreateCandidates < ActiveRecord::Migration[7.2]
  def change
    create_table :candidates do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone
      t.string :resume_url
      t.string :linkedin_url
      t.string :status, null: false, default: "new"
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end

    add_index :candidates, %i[company_id email]
  end
end
