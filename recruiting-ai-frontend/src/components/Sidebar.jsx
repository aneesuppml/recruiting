import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/companies", label: "Companies", icon: "🏢" },
  { to: "/users", label: "Users", icon: "👥" },
  { to: "/jobs", label: "Jobs", icon: "💼" },
  { to: "/candidates", label: "Candidates", icon: "👤" },
  { to: "/applications", label: "Applications", icon: "📋" },
  { to: "/interviews", label: "Interviews", icon: "📅" },
  { to: "/feedback", label: "Feedback", icon: "⭐" },
  { to: "/reports", label: "Reports", icon: "📈" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-56 border-r border-gray-200 bg-white">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
