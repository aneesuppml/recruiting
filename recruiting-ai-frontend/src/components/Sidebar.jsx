import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  User,
  ClipboardList,
  Calendar,
  Star,
  BarChart3,
  Settings,
} from "lucide-react";
import { usePermissions } from "../hooks/usePermissions";

const iconClass = "h-5 w-5 shrink-0";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, permission: "canViewDashboard" },
  { to: "/companies", label: "Companies", Icon: Building2, permission: "canViewCompanies" },
  { to: "/users", label: "Users", Icon: Users, permission: "canManageCompanyUsers" },
  { to: "/jobs", label: "Jobs", Icon: Briefcase, permission: "canViewJobs" },
  { to: "/candidates", label: "Candidates", Icon: User, permission: "canViewCandidates" },
  { to: "/applications", label: "Applications", Icon: ClipboardList, permission: "canViewApplications" },
  { to: "/interviews", label: "Interviews", Icon: Calendar, permission: "canViewInterviews" },
  { to: "/feedback", label: "Feedback", Icon: Star, permission: "canManageFeedback" },
  { to: "/reports", label: "Reports", Icon: BarChart3, permission: "canViewReports" },
  { to: "/settings", label: "Settings", Icon: Settings, permission: "canViewSettings" },
];

export function Sidebar() {
  const permissions = usePermissions();
  if (permissions.isSuperAdmin) return null;
  const allowed = navItems.filter((item) => permissions[item.permission]);

  return (
    <aside className="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-56 border-r border-gray-800 bg-gray-900">
      <nav className="flex flex-col gap-1 p-3">
        {allowed.map(({ to, label, Icon }) => (
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
  );
}
