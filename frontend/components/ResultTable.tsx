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
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-soft backdrop-blur">
      <div className="mb-4">
        <div className="text-xs font-medium uppercase tracking-wide text-emerald-300">Result table</div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Computed output</h2>
      </div>

      <div className="scrollbar-thin overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.05]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold text-slate-300">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-950/40">
            {rows.map((row, index) => (
              <tr key={index} className="transition hover:bg-white/[0.04]">
                {columns.map((column) => (
                  <td key={column} className="whitespace-nowrap px-4 py-3 text-slate-400">
                    {row[column] === null || row[column] === undefined ? "N/A" : String(row[column])}
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
