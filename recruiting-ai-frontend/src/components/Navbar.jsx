import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-lg font-semibold text-indigo-600">
          Recruiting AI
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
