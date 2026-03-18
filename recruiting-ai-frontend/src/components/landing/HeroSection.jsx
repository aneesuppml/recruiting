import { ShieldCheck, Users, Wrench } from "lucide-react";

export function HeroSection({ children }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-800 shadow-sm">
        <ShieldCheck className="h-4 w-4 text-blue-600" />
        RBAC + Tenant Isolation + Candidate Auth
      </div>

      <h1 className="mt-6 bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
        Recruiting AI for multi-tenant teams
      </h1>

      <p className="mt-4 text-base leading-relaxed text-gray-600">
        A modern ATS-style platform with job pipelines, AI resume shortlisting, interviews, feedback, and
        analytics. Built for recruiters and job seekers with role-based access control.
      </p>

      <div className="mt-8">{children}</div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <Wrench className="h-4 w-4 text-blue-600" />
          Blue/White/Dark Grey SaaS UI
        </span>
        <span className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          Admin, Recruiter, Hiring Manager, Interviewer
        </span>
      </div>
    </div>
  );
}

