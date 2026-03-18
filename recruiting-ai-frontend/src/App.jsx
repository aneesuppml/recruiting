import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { getDefaultPathForUser } from "./lib/permissions";
import { CandidateAuthProvider } from "./context/CandidateAuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import { CandidateProtectedRoute } from "./components/CandidateProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { CandidateLayout } from "./components/CandidateLayout";
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
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { CandidateLogin } from "./pages/candidate/CandidateLogin";
import { CandidateSignup } from "./pages/candidate/CandidateSignup";
import { JobBoard } from "./pages/candidate/JobBoard";
import { JobDetails } from "./pages/candidate/JobDetails";
import { ApplyJob } from "./pages/candidate/ApplyJob";
import { CandidateDashboard } from "./pages/candidate/CandidateDashboard";
import { ApplicationStatus } from "./pages/candidate/ApplicationStatus";

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
  const { isAuthenticated, loading, user } = useAuthContext();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" /></div>;
  if (isAuthenticated) return <Navigate to={getDefaultPathForUser(user)} replace />;
  return children;
}

function HomeRedirect() {
  const { isAuthenticated, loading, user } = useAuthContext();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={getDefaultPathForUser(user)} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CandidateAuthProvider>
          <Routes>
            {/* Candidate-facing (job board, candidate auth, dashboard) */}
            <Route path="/candidate/jobs" element={<CandidateLayout><JobBoard /></CandidateLayout>} />
            <Route path="/candidate/jobs/:id" element={<CandidateLayout><JobDetails /></CandidateLayout>} />
            <Route path="/candidate/login" element={<CandidateLogin />} />
            <Route path="/candidate/signup" element={<CandidateSignup />} />
            <Route
              path="/candidate/dashboard"
              element={
                <CandidateProtectedRoute>
                  <CandidateLayout><CandidateDashboard /></CandidateLayout>
                </CandidateProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications/:id"
              element={
                <CandidateProtectedRoute>
                  <CandidateLayout><ApplicationStatus /></CandidateLayout>
                </CandidateProtectedRoute>
              }
            />
            <Route
              path="/candidate/apply/:jobId"
              element={
                <CandidateProtectedRoute>
                  <CandidateLayout><ApplyJob /></CandidateLayout>
                </CandidateProtectedRoute>
              }
            />

            {/* Recruiter/internal */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Companies /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Users /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Jobs /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Candidates /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Applications /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Interviews /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Feedback /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Reports /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Settings /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute>
                  <Layout><Profile /></Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </CandidateAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
