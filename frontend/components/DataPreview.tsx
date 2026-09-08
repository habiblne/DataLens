import type { UploadResponse } from "@/lib/types";

type DataPreviewProps = {
  dataset: UploadResponse;
  onReset: () => void;
};

export default function DataPreview({ dataset, onReset }: DataPreviewProps) {
  const previewColumns = dataset.column_names.slice(0, 8);

  return (
    <section className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {dataset.file_name}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Dataset preview</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95"
        >
          Reset
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {dataset.column_names.map((column) => (
          <span
            key={column}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-white/20"
          >
            {column}
          </span>
        ))}
      </div>

      <div className="scrollbar-thin overflow-x-auto rounded-lg border border-white/[0.08] bg-slate-950/40 shadow-inner">
        <table className="min-w-full divide-y divide-white/[0.06] text-left text-sm">
          <thead className="bg-white/[0.04]">
            <tr>
              {previewColumns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] bg-slate-950/40">
            {dataset.preview.map((row, index) => (
              <tr key={index} className="transition-colors hover:bg-white/[0.03]">
                {previewColumns.map((column) => (
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
