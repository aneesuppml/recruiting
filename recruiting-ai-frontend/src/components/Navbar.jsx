import { Link } from "react-router-dom";
import { UserProfileMenu } from "./UserProfileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-lg font-semibold text-indigo-600">
          Recruiting AI
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <UserProfileMenu />
      </div>
    </header>
  );
}
