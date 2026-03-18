import { useState } from "react";
import { useJobs } from "../hooks/useJobs";
import { usePermissions } from "../hooks/usePermissions";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { FormModal } from "../components/FormModal";

const defaultJob = { title: "", description: "", status: "draft", department: "", location: "" };

export function Jobs() {
  const { jobs, loading, error, createJob, updateJob } = useJobs();
  const { canManageJobs } = usePermissions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultJob);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultJob);
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditing(job);
    setForm({
      title: job.title,
      description: job.description,
      status: job.status,
      department: job.department,
      location: job.location,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateJob(editing.id, form);
      } else {
        await createJob(form);
      }
      setModalOpen(false);
    } catch {
      // errors are surfaced via the hook's `error` state
    }
  };

  const handleCloseJob = async (job) => {
    if (!window.confirm(`Close job "${job.title}"?`)) return;
    try {
      await updateJob(job.id, { ...job, status: "closed" });
    } catch {
      // errors are surfaced via the hook's `error` state
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "department", label: "Department" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    ...(canManageJobs
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button type="button" onClick={() => openEdit(row)} className="text-blue-700 hover:underline">
                  Edit
                </button>
                {row.status !== "closed" && (
                  <button type="button" onClick={() => handleCloseJob(row)} className="text-red-600 hover:underline">
                    Close
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
        {canManageJobs && (
          <button type="button" onClick={openCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            Create job
          </button>
        )}
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && !jobs.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={jobs} emptyMessage="No jobs yet." />
      )}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit job" : "Create job"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
              rows={3}
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
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
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
