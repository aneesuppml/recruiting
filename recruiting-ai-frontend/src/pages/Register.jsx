import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Register() {
  // Company details
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Admin user details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { signup, loading, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    await signup({
      // Admin
      name,
      email,
      password,
      passwordConfirmation,
      // Company
      company_name: companyName,
      domain,
      company_size: companySize || undefined,
      industry: industry || undefined,
      address_line1: addressLine1,
      address_line2: addressLine2 || undefined,
      city,
      state,
      country,
      postal_code: postalCode,
      contact_email: contactEmail,
      contact_phone: contactPhone,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-xl font-semibold text-gray-900">Recruiting AI</h1>
        <h2 className="mb-6 text-center text-sm font-medium text-gray-600">
          Create your company account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="text-sm font-semibold text-gray-900">Company Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Domain
                </label>
                <input
                  id="domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  placeholder="e.g., example.com"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                  Company size (optional)
                </label>
                <input
                  id="companySize"
                  type="text"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  placeholder="e.g., 1-10"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry (optional)
                </label>
                <input
                  id="industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Software"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-gray-900">Address</h4>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                    Address line 1
                  </label>
                  <input
                    id="addressLine1"
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                    Address line 2 (optional)
                  </label>
                  <input
                    id="addressLine2"
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Postal code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact email
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Contact phone
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="text-sm font-semibold text-gray-900">Admin User Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="adminName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="adminEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="adminPasswordConfirmation" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  id="adminPasswordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
