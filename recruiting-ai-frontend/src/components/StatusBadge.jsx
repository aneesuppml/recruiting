const statusColors = {
  applied: "bg-blue-100 text-blue-800",
  screening: "bg-purple-100 text-purple-800",
  shortlisted: "bg-blue-100 text-blue-800",
  interview: "bg-yellow-100 text-yellow-800",
  under_review: "bg-amber-100 text-amber-800",
  offer: "bg-orange-100 text-orange-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-600",
  new: "bg-blue-100 text-blue-800",
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-gray-100 text-gray-600",
};

function formatStatus(status) {
  if (!status) return "—";
  return String(status).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status }) {
  const s = (status || "").toLowerCase().replace(/\s/g, "_");
  const className = statusColors[s] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {formatStatus(status)}
    </span>
  );
}
