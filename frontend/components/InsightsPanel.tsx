type InsightsPanelProps = {
  insights: string[];
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const visibleInsights = insights.length > 0 ? insights : ["No automatic insights were returned for this result."];

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-soft backdrop-blur">
      <div className="mb-4">
        <div className="text-xs font-medium uppercase tracking-wide text-emerald-300">Automatic insights</div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">What stands out</h2>
      </div>

      <div className="space-y-3">
        {visibleInsights.map((insight, index) => (
          <div key={`${insight}-${index}`} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.05] p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-bold text-emerald-200">
              {index + 1}
            </span>
            <p className="text-sm leading-6 text-slate-300">{insight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
