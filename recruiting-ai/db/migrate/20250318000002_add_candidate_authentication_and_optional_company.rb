# frozen_string_literal: true

class AddCandidateAuthenticationAndOptionalCompany < ActiveRecord::Migration[7.0]
  def change
    add_column :candidates, :password_digest, :string, null: true
    add_column :candidates, :location, :string
    change_column_null :candidates, :company_id, true
    add_index :candidates, :email, unique: true, where: "company_id IS NULL", name: "index_candidates_on_email_when_external"
  end
end
