# frozen_string_literal: true

class AddAdminUserIdToCompanies < ActiveRecord::Migration[7.2]
  def change
    add_reference :companies, :admin_user, foreign_key: { to_table: :users }, index: true

    # Backfill for existing dev data:
    # If a user is currently an Admin and is tied to a company via users.company_id,
    # treat that user as the company's admin_user (unless already set).
    #
    # NOTE: Membership doesn't include company_id, so we rely on users.company_id.
    reversible do |dir|
      dir.up do
        execute <<~SQL.squish
          UPDATE companies c
          SET admin_user_id = u.id
          FROM users u
          INNER JOIN memberships m ON m.user_id = u.id
          INNER JOIN roles r ON r.id = m.role_id
          WHERE c.id = u.company_id
            AND r.name = 'Admin'
            AND c.admin_user_id IS NULL
        SQL
      end
    end
  end
end

