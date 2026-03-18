import { Link } from "react-router-dom";
import { FileText, Users } from "lucide-react";

export function LoginTypeTabs({ active = "internal" }) {
  const tabs = [
    {
      id: "internal",
      label: "Internal",
      subtitle: "Recruiter / Admin / Interviewer",
      Icon: Users,
      to: "/login/internal",
    },
    {
      id: "candidate",
      label: "Candidate",
      subtitle: "Job board + applications",
      Icon: FileText,
      to: "/login/candidate",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
      <div className="grid grid-cols-2 gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.Icon;
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={
                isActive
                  ? "flex flex-col justify-center gap-1 rounded-xl bg-gray-900 px-4 py-3 text-center shadow-sm"
                  : "flex flex-col justify-center gap-1 rounded-xl px-4 py-3 text-center hover:bg-gray-50"
              }
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className={isActive ? "h-4 w-4 text-blue-300" : "h-4 w-4 text-blue-700"} />
                <span className={isActive ? "text-sm font-semibold text-white" : "text-sm font-semibold text-gray-900"}>
                  {tab.label}
                </span>
              </div>
              <span className={isActive ? "text-xs text-white/70" : "text-xs text-gray-500"}>{tab.subtitle}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

