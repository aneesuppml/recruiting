export function DashboardCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          {trend != null && (
            <p className={`mt-1 text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend >= 0 ? "+" : ""}{trend}% from last period
            </p>
          )}
        </div>
        {icon && <div className="flex h-9 w-9 items-center justify-center text-gray-500 [&_svg]:h-7 [&_svg]:w-7">{icon}</div>}
      </div>
    </div>
  );
}
