import { Link } from "react-router-dom";

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-200">
          <li>
            <Link
              to="/settings/profile"
              className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50"
            >
              <span className="font-medium">Profile</span>
              <span className="text-gray-400">→</span>
            </Link>
          </li>
          <li className="px-6 py-4 text-gray-500">
            <span className="font-medium">Notifications</span>
            <span className="ml-2 text-sm">(Coming soon)</span>
          </li>
          <li className="px-6 py-4 text-gray-500">
            <span className="font-medium">Security</span>
            <span className="ml-2 text-sm">(Coming soon)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
