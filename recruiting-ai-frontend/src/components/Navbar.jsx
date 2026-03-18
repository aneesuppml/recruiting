import { Link } from "react-router-dom";
import { UserProfileMenu } from "./UserProfileMenu";
import { useAuthContext } from "../context/AuthContext";
import { CompanySwitcher } from "./CompanySwitcher";

export function Navbar() {
  const { user } = useAuthContext();
  const pending = user?.company_status === "pending" || user?.company_status === "rejected";
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Link
          to={pending ? "/pending-approval" : "/dashboard"}
          className="text-lg font-semibold text-white hover:text-blue-200"
        >
          Recruiting AI
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <CompanySwitcher />
        <UserProfileMenu />
      </div>
    </header>
  );
}
