import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthContext } from "../context/AuthContext";

function getInitials(user) {
  if (user?.name && typeof user.name === "string" && user.name.trim()) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return user.name.trim().slice(0, 2).toUpperCase();
  }
  const email = user?.email;
  if (!email || typeof email !== "string") return "?";
  const local = email.split("@")[0] || "";
  if (local.length >= 2) return local.slice(0, 2).toUpperCase();
  return local.toUpperCase() || "?";
}

export function SuperAdminProfileMenu() {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const displayName = user.name || user.email || "User";
  const initials = getInitials(user);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const doLogout = () => {
    setOpen(false);
    logout(); // clears JWT + redirects to /login
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white ring-1 ring-inset ring-white/15">
          {initials}
        </span>
        <span className="hidden max-w-[180px] truncate text-left text-sm text-gray-200 sm:block">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg" role="menu">
          <div className="border-b border-gray-100 px-3 py-2">
            <p className="truncate text-sm font-medium text-gray-900">{displayName}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => go("/super-admin/profile")}
            className="w-full px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
            role="menuitem"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={doLogout}
            className="w-full px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

