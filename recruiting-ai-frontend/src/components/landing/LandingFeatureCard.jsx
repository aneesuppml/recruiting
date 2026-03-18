export function LandingFeatureCard({ Icon, title, description, compact = false }) {
  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          : "rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

