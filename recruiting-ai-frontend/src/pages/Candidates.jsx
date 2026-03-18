import { useState } from "react";
import { useCandidates } from "../hooks/useCandidates";
import { usePermissions } from "../hooks/usePermissions";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { FormModal } from "../components/FormModal";

const defaultCandidate = { name: "", email: "", phone: "", resume_url: "", linkedin_url: "", status: "new" };

export function Candidates() {
  const { candidates, loading, error, createCandidate, updateCandidate, setError } = useCandidates();
  const { canManageCandidates } = usePermissions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultCandidate);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultCandidate);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone || "",
      resume_url: c.resume_url || "",
      linkedin_url: c.linkedin_url || "",
      status: c.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCandidate(editing.id, form);
      } else {
        await createCandidate(form);
      }
      setModalOpen(false);
    } catch (_) {}
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "resume_url",
      label: "Resume",
      render: (row) =>
        row.resume_url ? (
          <a href={row.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
            Link
          </a>
        ) : (
          "—"
        ),
    },
    {
      key: "ai_match_score",
      label: "AI Score",
      render: (row) => (row.ai_match_score != null ? `${row.ai_match_score}%` : "—"),
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    ...(canManageCandidates
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <button type="button" onClick={() => openEdit(row)} className="text-blue-700 hover:underline">
                Edit
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
        {canManageCandidates && (
          <button type="button" onClick={openCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            Add candidate
          </button>
        )}
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && !candidates.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={candidates} emptyMessage="No candidates yet." />
      )}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit candidate" : "Add candidate"}>
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume URL</label>
            <input
              type="url"
              value={form.resume_url}
              onChange={(e) => setForm((f) => ({ ...f, resume_url: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              type="url"
              value={form.linkedin_url}
              onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="new">New</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
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
