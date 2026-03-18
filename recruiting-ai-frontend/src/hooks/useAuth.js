import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const navigate = useNavigate();
  const { login: setAuth, logout: doLogout } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const {
        name,
        email,
        password,
        passwordConfirmation,
        company_name,
        domain,
        company_size,
        industry,
        address_line1,
        address_line2,
        city,
        state,
        country,
        postal_code,
        contact_email,
        contact_phone,
      } = payload || {};

      const { data } = await api.post("/signup", {
        user: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          company_name,
          domain,
          company_size,
          industry,
          address_line1,
          address_line2,
          city,
          state,
          country,
          postal_code,
          contact_email,
          contact_phone,
        },
      });

      if (data?.token) {
        setAuth(data.user, data.token);
        const dest = data?.user?.company_status === "pending" ? "/pending-approval" : "/dashboard";
        navigate(dest);
      } else if (data?.pending) {
        navigate("/pending-approval");
      } else {
        navigate("/login");
      }
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Signup failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/login", {
        user: { email, password },
      });
      setAuth(data.user, data.token);
      const dest = data?.user?.company_status === "pending" ? "/pending-approval" : "/dashboard";
      navigate(dest);
      return data;
    } catch (err) {
      const apiError = err.response?.data?.error;
      if (apiError === "Account Pending Approval") {
        navigate("/pending-approval");
        return null;
      }

      const msg = apiError || "Invalid email or password";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    doLogout();
    navigate("/login");
  };

  return { signup, login, logout, loading, error, setError };
}
