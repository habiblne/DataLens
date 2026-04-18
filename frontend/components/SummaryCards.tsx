import type { UploadResponse } from "@/lib/types";

type SummaryCardsProps = {
  dataset: UploadResponse;
};

export default function SummaryCards({ dataset }: SummaryCardsProps) {
  const missingTotal = Object.values(dataset.summary.missing_values).reduce((sum, value) => sum + value, 0);
  const cards = [
    { label: "Rows", value: dataset.rows.toLocaleString(), detail: "records loaded" },
    { label: "Columns", value: dataset.columns.toLocaleString(), detail: "fields detected" },
    { label: "Numeric", value: dataset.summary.numeric_columns.length.toString(), detail: "ready for metrics" },
    { label: "Missing", value: missingTotal.toLocaleString(), detail: "blank cells found" }
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-soft backdrop-blur">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{card.value}</div>
          <div className="mt-1 text-sm text-slate-400">{card.detail}</div>
        </div>
      ))}
    </section>
  );
}
