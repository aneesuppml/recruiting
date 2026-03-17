import { useState, useEffect } from "react";
import { useCompanies } from "../hooks/useCompanies";
import { useAuthContext } from "../context/AuthContext";
import { DataTable } from "../components/DataTable";
import { FormModal } from "../components/FormModal";

export function Users() {
  const { user } = useAuthContext();
  const { companies, users, fetchCompanies, fetchCompanyUsers, inviteUser, loading, error, setError } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState(user?.company_id || null);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Recruiter");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (user?.company_id && selectedCompanyId == null) setSelectedCompanyId(user.company_id);
  }, [user?.company_id, selectedCompanyId]);

  useEffect(() => {
    if (selectedCompanyId) fetchCompanyUsers(selectedCompanyId);
  }, [selectedCompanyId, fetchCompanyUsers]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!selectedCompanyId) return;
    try {
      await inviteUser(selectedCompanyId, email, password, role);
      setModalOpen(false);
      setEmail("");
      setPassword("");
    } catch (_) {}
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "email", label: "Email" },
    { key: "roles", label: "Roles", render: (row) => (Array.isArray(row.roles) ? row.roles.join(", ") : "—") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="flex items-center gap-2">
          <select
            value={selectedCompanyId ?? ""}
            onChange={(e) => setSelectedCompanyId(e.target.value ? Number(e.target.value) : null)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={!selectedCompanyId}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Invite user
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {loading && !users.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={selectedCompanyId ? users : []}
          emptyMessage={selectedCompanyId ? "No users in this company." : "Select a company to view users."}
        />
      )}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite user">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Interviewer">Interviewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
              Invite
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
