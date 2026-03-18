import { NavLink } from "react-router-dom";
import { Building2, Users, BarChart3, Shield } from "lucide-react";
import { SuperAdminProfileMenu } from "./SuperAdminProfileMenu";

const iconClass = "h-5 w-5 shrink-0";

const navItems = [
  { to: "/super-admin/companies", label: "Companies", Icon: Building2 },
  { to: "/super-admin/users", label: "Users", Icon: Users },
  { to: "/super-admin/analytics", label: "System Analytics", Icon: BarChart3 },
];

export function SuperAdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 shadow-sm">
        <div className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5 text-blue-300" aria-hidden />
          <span className="text-sm font-semibold tracking-wide">Super Admin</span>
        </div>
        <SuperAdminProfileMenu />
      </header>

      <aside className="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-64 border-r border-gray-800 bg-gray-900">
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600/15 text-blue-200 ring-1 ring-inset ring-blue-500/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className={iconClass} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen bg-white pl-64 pt-14">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

