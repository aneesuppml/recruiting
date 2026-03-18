import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { useSuperAdminCompanies } from "../../hooks/useSuperAdmin";

export function SuperAdminCompanies() {
  const { companies, loading, error, setError, createCompany, updateCompany } = useSuperAdminCompanies();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", domain: "", active: true });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", domain: "", active: true });
    setModalOpen(true);
  };

  const openEdit = (company) => {
    setEditing(company);
    setForm({
      name: company.name ?? "",
      domain: company.domain ?? "",
      active: company.active !== false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCompany(editing.id, form);
      } else {
        await createCompany(form);
      }
      setModalOpen(false);
    } catch {
      // error is shown via hook state
    }
  };

  const columns = useMemo(() => ([
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "domain", label: "Domain" },
    { key: "active", label: "Status", render: (row) => (row.active === false ? "Inactive" : "Active") },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button type="button" onClick={() => openEdit(row)} className="text-blue-700 hover:underline">
          Edit
        </button>
      ),
    },
  ]), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="mt-1 text-sm text-gray-600">Create, update, and deactivate tenant companies.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Create company
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert" onAnimationEnd={() => setError(null)}>
          {error}
        </div>
      )}

      {loading && !companies.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={companies} emptyMessage="No companies found." />
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Update company" : "Create company"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Domain</label>
            <input
              type="text"
              value={form.domain}
              onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
              placeholder="example.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="company-active"
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="company-active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

