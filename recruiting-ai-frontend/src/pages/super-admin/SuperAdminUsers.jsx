import { useMemo } from "react";
import { DataTable } from "../../components/DataTable";
import { useSuperAdminUsers } from "../../hooks/useSuperAdmin";

export function SuperAdminUsers() {
  const { users, loading, error, setError } = useSuperAdminUsers();

  const columns = useMemo(() => ([
    { key: "id", label: "ID" },
    { key: "name", label: "Name", render: (row) => row.name || "—" },
    { key: "email", label: "Email" },
    { key: "company_name", label: "Company", render: (row) => row.company_name || "—" },
    { key: "roles", label: "Roles", render: (row) => (Array.isArray(row.roles) ? row.roles.join(", ") : "—") },
  ]), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-600">View all users across all companies.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert" onAnimationEnd={() => setError(null)}>
          {error}
        </div>
      )}

      {loading && !users.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={users} emptyMessage="No users found." />
      )}
    </div>
  );
}

