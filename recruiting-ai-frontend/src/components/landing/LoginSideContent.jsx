export function LoginSideContent({ eyebrow, title, description, bullets }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gray-900/95 p-6 text-white shadow-sm backdrop-blur-sm">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-blue-600/15 px-3 py-1 text-xs font-semibold text-blue-200">
        {eyebrow}
      </div>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{description}</p>

      <div className="mt-5 space-y-3">
        {bullets?.map((b) => (
          <div
            key={b.text}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
          >
            {b.Icon ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600/20">
                <b.Icon className="h-4 w-4 text-blue-200" />
              </div>
            ) : null}
            <div>
              <p className="text-sm font-semibold text-white">{b.text}</p>
              {b.subtext ? <p className="mt-0.5 text-xs text-white/60">{b.subtext}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

