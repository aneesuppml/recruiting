import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function ProductHeader({ right }) {
  return (
    <header className="w-full border-b border-gray-200 bg-gray-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Recruiting AI</div>
            <div className="text-xs text-white/70">Multi-tenant ATS + AI shortlisting</div>
          </div>
        </Link>

        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </div>
    </header>
  );
}

