export function DataTable({ columns, data, keyExtractor = (row) => row.id, emptyMessage = "No data" }) {
  if (!data?.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/70">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-gray-50/70">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
