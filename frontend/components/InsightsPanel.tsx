type InsightsPanelProps = {
  insights: string[];
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const visibleInsights = insights.length > 0 ? insights : ["No automatic insights were returned for this result."];

  return (
    <section className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Automatic insights
        </div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">What stands out</h2>
      </div>

      <div className="space-y-3">
        {visibleInsights.map((insight, index) => (
          <div
            key={`${insight}-${index}`}
            className="flex gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 shadow-sm transition-all hover:border-white/20 hover:bg-white/[0.05]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              {index + 1}
            </span>
            <p className="text-sm leading-6 text-slate-300">{insight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
