import { useState } from "react";
import { Link } from "react-router-dom";
import { useCandidateAuth } from "../../hooks/useCandidateAuth";
import { ProductHeader } from "../../components/landing/ProductHeader";

export function CandidateSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const { signup, loading, error, setError } = useCandidateAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const skillsList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
    await signup({
      name,
      email,
      phone: phone || undefined,
      password,
      password_confirmation: passwordConfirmation,
      location: location || undefined,
      skills: skillsList.length ? skillsList : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
      <ProductHeader />

      <div className="px-4 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="w-full max-w-4xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:mx-auto">
            <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
              <h1 className="text-xl font-semibold text-gray-900">Create candidate account</h1>
              <p className="mt-1 text-sm text-gray-600">Browse jobs, apply, and track your pipeline</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">{error}</div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location (optional)
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700"
              >
                Skills (comma-separated, optional)
              </label>
              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Ruby, Rails, React"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password-confirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <input
                id="password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/candidate/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
        </p>
          </div>
        </div>
      </div>
    </div>
  );
}
