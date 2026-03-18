import { Link } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  GitPullRequest,
  Layers,
  Search,
} from "lucide-react";
import { LandingFeatureCard } from "../components/landing/LandingFeatureCard";
import { LoginOptionTabs } from "../components/landing/LoginOptionTabs";
import { FlowSteps } from "../components/landing/FlowSteps";
import { HeroSection } from "../components/landing/HeroSection";
import { ProductHeader } from "../components/landing/ProductHeader";

export function ProductLanding() {
  const features = [
    {
      Icon: Building2,
      title: "Companies (Multi-tenant)",
      description: "Create and manage tenant companies with pending/rejected verification and active tenant switching.",
    },
    {
      Icon: Layers,
      title: "Jobs / Job Board",
      description: "Recruiter job management and a candidate-facing job board with fast search filters.",
    },
    {
      Icon: Search,
      title: "Candidates / AI Shortlisting",
      description: "AI resume parsing + match scoring to rank candidates per role and pipeline stage.",
    },
    {
      Icon: GitPullRequest,
      title: "Applications & Pipeline",
      description: "Track application statuses end-to-end with AI score and parsed skills for better review.",
    },
    {
      Icon: CalendarDays,
      title: "Interviews & Feedback",
      description: "Schedule interviews, capture meeting links, and collect structured ratings and feedback.",
    },
    {
      Icon: BarChart3,
      title: "Dashboard & Analytics",
      description: "Operational metrics: jobs, candidates, interviews, conversion, and hiring rate.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProductHeader
        right={
          <div className="flex items-center gap-2">
            <Link
              to="/login/internal"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Internal Login
            </Link>
            <Link
              to="/login/candidate"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
            >
              Candidate Login
            </Link>
          </div>
        }
      />
      <div className="relative overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-50 blur-2xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-50 blur-2xl" />

        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <HeroSection>
                <LoginOptionTabs />

                <div className="mt-8 flex items-center gap-4">
                <Link
                  to="/candidate/jobs"
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                >
                  Browse Jobs as Candidate
                </Link>
                <Link
                  to="/register"
                    className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                >
                  Company Signup
                </Link>
                </div>
              </HeroSection>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="rounded-2xl bg-gray-900 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15">
                      <Briefcase className="h-5 w-5 text-blue-200" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Product Modules</p>
                      <p className="text-xs text-white/70">Everything connected through tenant context</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <FlowSteps />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <LandingFeatureCard
                    Icon={FileText}
                    title="AI Resume Shortlisting"
                    description="Parse + extract skills + rank candidates."
                    compact
                  />
                  <LandingFeatureCard
                    Icon={CalendarDays}
                    title="Interviews & Feedback"
                    description="Structured ratings and decisions."
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-semibold text-gray-900">Built for every module</h2>
        <p className="mt-2 text-sm text-gray-600">
          Explore the key models and flows your team uses every day.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, description }) => (
            <LandingFeatureCard
              key={title}
              Icon={Icon}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-xl font-semibold text-white">Ready to get started?</h3>
              <p className="mt-2 text-sm text-gray-200">
                Choose your login type and jump into the correct experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login/internal"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Internal Login
              </Link>
              <Link
                to="/login/candidate"
                className="rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Candidate Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

