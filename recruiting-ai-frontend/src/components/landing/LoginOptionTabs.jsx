import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ClipboardCheck, FileText } from "lucide-react";

export function LoginOptionTabs() {
  const [selected, setSelected] = useState("internal");

  const options = useMemo(
    () => [
      {
        id: "internal",
        label: "Internal (Recruiter)",
        subtitle: "Admin / Recruiter / Hiring Manager / Interviewer",
        Icon: Users,
        href: "/login/internal",
      },
      {
        id: "candidate",
        label: "Candidate",
        subtitle: "Browse jobs, apply, track pipeline",
        Icon: FileText,
        href: "/login/candidate",
      },
    ],
    []
  );

  const current = options.find((o) => o.id === selected) || options[0];

  const CurrentIcon = current.Icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
            <CurrentIcon className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{current.label}</p>
            <p className="text-xs text-gray-500">{current.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 rounded-xl bg-gray-50 p-1">
        {options.map((opt) => {
          const active = opt.id === selected;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={
                active
                  ? "flex-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm"
                  : "flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              }
            >
              {opt.id === "internal" ? "Internal" : "Candidate"}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <Link
          to={current.href}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <ClipboardCheck className="h-4 w-4" />
          Continue to Login
        </Link>
      </div>
    </div>
  );
}

