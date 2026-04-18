import type { UploadResponse } from "@/lib/types";

type DataPreviewProps = {
  dataset: UploadResponse;
  onReset: () => void;
};

export default function DataPreview({ dataset, onReset }: DataPreviewProps) {
  const previewColumns = dataset.column_names.slice(0, 8);

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-soft backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-emerald-300">{dataset.file_name}</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Dataset preview</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-100"
        >
          Reset
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {dataset.column_names.map((column) => (
          <span key={column} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-300">
            {column}
          </span>
        ))}
      </div>

      <div className="scrollbar-thin overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.05]">
            <tr>
              {previewColumns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold text-slate-300">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-950/40">
            {dataset.preview.map((row, index) => (
              <tr key={index} className="transition hover:bg-white/[0.04]">
                {previewColumns.map((column) => (
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
