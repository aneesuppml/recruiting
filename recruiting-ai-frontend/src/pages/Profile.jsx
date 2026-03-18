import { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";
import { useAuthContext } from "../context/AuthContext";

function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.trim().slice(0, 2).toUpperCase();
  }
  if (email && typeof email === "string") {
    const local = email.split("@")[0] || "";
    return local.slice(0, 2).toUpperCase() || "?";
  }
  return "?";
}

export function Profile() {
  const { user: authUser } = useAuthContext();
  const { profile, loading, error, success, setError, setSuccess, fetchProfile, updateProfile } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
    } else if (authUser) {
      setName(authUser.name ?? "");
      setEmail(authUser.email ?? "");
    }
  }, [profile, authUser]);

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await updateProfile({ name: name.trim() || null, email: email.trim() });
    } catch (_) {}
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPassword !== newPasswordConfirm) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await updateProfile({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirm,
      });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setSuccess("Password updated successfully.");
    } catch (_) {}
  };

  if (!authUser) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <p className="font-medium">Please log in to view your profile.</p>
      </div>
    );
  }

  const initials = getInitials(name || profile?.name, email || profile?.email || authUser?.email);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account details and password.</p>
      </div>

      {/* Profile header with avatar */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
          {initials}
        </span>
        <div>
          <p className="font-medium text-gray-900">{name || "No name set"}</p>
          <p className="text-sm text-gray-500">{email}</p>
          {profile?.roles?.length > 0 && (
            <p className="mt-1 text-xs text-gray-400">{profile.roles.join(", ")}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
          {success}
        </div>
      )}

      {/* Profile details card */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Account details</h2>
          <p className="mt-0.5 text-sm text-gray-500">Update your name and email address.</p>
        </div>
        <form onSubmit={handleDetailsSubmit} className="p-6 pt-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {(profile?.company_name != null || profile?.company_id != null) && (
              <div>
                <span className="block text-sm font-medium text-gray-500">Company</span>
                <span className="mt-0.5 block text-gray-900">{profile.company_name ?? "—"}</span>
              </div>
            )}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Change password card */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Change password</h2>
          <p className="mt-0.5 text-sm text-gray-500">Set a new password for your account.</p>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 pt-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !newPasswordConfirm}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Updating…" : "Change password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
