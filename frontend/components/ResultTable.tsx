import type { DataRecord } from "@/lib/types";

type ResultTableProps = {
  rows?: DataRecord[] | null;
};

export default function ResultTable({ rows }: ResultTableProps) {
  if (!rows || rows.length === 0) {
    return null;
  }

  const columns = Object.keys(rows[0]);

  return (
    <section className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Result table
        </div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Computed output</h2>
      </div>

      <div className="scrollbar-thin overflow-x-auto rounded-lg border border-white/[0.08] bg-slate-950/40 shadow-inner">
        <table className="min-w-full divide-y divide-white/[0.06] text-left text-sm">
          <thead className="bg-white/[0.04]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] bg-slate-950/40">
            {rows.map((row, index) => (
              <tr key={index} className="transition-colors hover:bg-white/[0.03]">
                {columns.map((column) => (
                  <td key={column} className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {row[column] === null || row[column] === undefined ? (
                      <span className="text-slate-500">N/A</span>
                    ) : (
                      String(row[column])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
