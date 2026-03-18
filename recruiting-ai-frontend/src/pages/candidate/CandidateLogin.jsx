import { useState } from "react";
import { Link } from "react-router-dom";
import { useCandidateAuth } from "../../hooks/useCandidateAuth";

export function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, setError } = useCandidateAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    await login(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-900">Recruiting AI – Candidates</h1>
        <h2 className="mb-4 text-center text-sm font-medium text-gray-600">Sign in to your candidate account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label htmlFor="candidate-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="candidate-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="candidate-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="candidate-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/candidate/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          <Link to="/candidate/jobs" className="text-indigo-600 hover:text-indigo-500">Browse jobs</Link>
        </p>
      </div>
    </div>
  );
}
