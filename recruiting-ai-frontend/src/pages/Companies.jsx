import { useState } from "react";
import { useCompanies } from "../hooks/useCompanies";
import { usePermissions } from "../hooks/usePermissions";
import { DataTable } from "../components/DataTable";
import { FormModal } from "../components/FormModal";

export function Companies() {
  const { companies, loading, error, createCompany, setError } = useCompanies();
  const { canCreateCompany } = usePermissions();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCompany(name, domain);
      setModalOpen(false);
      setName("");
      setDomain("");
    } catch (_) {}
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "domain", label: "Domain" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
        {canCreateCompany && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Create company
          </button>
        )}
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" onAnimationEnd={() => setError(null)}>
          {error}
        </div>
      )}
      {loading && !companies.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={companies} emptyMessage="No companies yet. Create one to get started." />
      )}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create company">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              Create
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
