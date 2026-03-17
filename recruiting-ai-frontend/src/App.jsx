import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Companies } from "./pages/Companies";
import { Users } from "./pages/Users";
import { Jobs } from "./pages/Jobs";
import { Candidates } from "./pages/Candidates";
import { Applications } from "./pages/Applications";
import { Interviews } from "./pages/Interviews";
import { Feedback } from "./pages/Feedback";
import { Reports } from "./pages/Reports";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="pl-56 pt-14 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Layout><Companies /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout><Users /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Layout><Jobs /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <Layout><Candidates /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Layout><Applications /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <Layout><Interviews /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <Layout><Feedback /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout><Reports /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
