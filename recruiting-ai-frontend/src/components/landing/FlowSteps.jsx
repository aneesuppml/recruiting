import { ArrowRight, FileText, CalendarDays, BarChart3, Sparkles } from "lucide-react";

function Step({ Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
        <Icon className="h-5 w-5 text-blue-700" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export function FlowSteps() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Step Icon={FileText} title="Apply" description="Candidate applies to a job." />
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-blue-600" />
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">AI Shortlisting</span>
        </div>
        <Step Icon={Sparkles} title="AI Score" description="Parse resume + extract skills + rank." />
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-blue-600" />
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Scheduling</span>
        </div>
        <Step Icon={CalendarDays} title="Interview" description="Schedule rounds + meeting links." />
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-blue-600" />
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Feedback</span>
        </div>
        <Step Icon={BarChart3} title="Analytics" description="Track pipeline and conversion rate." />
      </div>
    </div>
  );
}

