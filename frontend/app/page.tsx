"use client";

import { useState } from "react";

import dynamic from "next/dynamic";

import AskForm from "@/components/AskForm";
const ChartRenderer = dynamic(() => import("@/components/ChartRenderer"), { ssr: false });
import DataPreview from "@/components/DataPreview";
import ErrorAlert from "@/components/ErrorAlert";
import InsightsPanel from "@/components/InsightsPanel";
import LoadingState from "@/components/LoadingState";
import ResultTable from "@/components/ResultTable";
import SummaryCards from "@/components/SummaryCards";
import UploadBox from "@/components/UploadBox";
import { analyzeDataset, uploadCsv } from "@/lib/api";
import type { AnalyzeResponse, UploadResponse } from "@/lib/types";

export default function Home() {
  const [dataset, setDataset] = useState<UploadResponse | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const hasResultTable = Boolean(result?.table?.length);

  async function handleUpload(file: File) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a file ending in .csv.");
      return;
    }

    setError(null);
    setResult(null);
    setDataset(null);
    setIsUploading(true);

    try {
      const response = await uploadCsv(file);
      setDataset(response);
    } catch (err) {
      setDataset(null);
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAsk(question: string) {
    if (!dataset) {
      return;
    }

    setError(null);
    setResult(null);
    setIsAnalyzing(true);
    setLastQuestion(question);

    try {
      const response = await analyzeDataset({
        dataset_id: dataset.dataset_id,
        question
      });
      setResult(response);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function resetDataset() {
    setDataset(null);
    setResult(null);
    setError(null);
    setLastQuestion(null);
  }

  return (
    <main className="min-h-screen px-6 py-8 text-slate-100 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 overflow-hidden rounded-lg border border-white/[0.08] bg-slate-950/60 p-6 shadow-card backdrop-blur-xl lg:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="9" stroke="url(#hGrad)" strokeWidth="2" strokeDasharray="44 8" strokeLinecap="round"/>
                    <rect x="11" y="15" width="1.5" height="5" rx="0.75" fill="#34d399"/>
                    <rect x="14" y="13" width="1.5" height="7" rx="0.75" fill="#6ee7b7"/>
                    <rect x="17" y="16" width="1.5" height="4" rx="0.75" fill="#38bdf8"/>
                    <rect x="20" y="14" width="1.5" height="6" rx="0.75" fill="#818cf8"/>
                    <circle cx="16" cy="16" r="1.5" fill="#ffffff"/>
                    <defs>
                      <linearGradient id="hGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#34d399"/>
                        <stop offset="50%" stopColor="#10b981"/>
                        <stop offset="100%" stopColor="#06b6d4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <h1 className="max-w-3xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent lg:text-7xl">
                  DataLens
                </h1>
              </div>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Ask your data anything. Upload a CSV, get a fast answer, see the chart, and walk away with the story.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur shadow-sm transition-colors hover:border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  CSV preview
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur shadow-sm transition-colors hover:border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  AI analysis plan
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur shadow-sm transition-colors hover:border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  Charts and insights
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-slate-900/40 p-4 shadow-card backdrop-blur-md lg:w-80">
              <div className="text-sm font-semibold text-white">Fast analysis flow</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-medium text-slate-300">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-3 transition-colors hover:border-white/20">Upload</div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-3 transition-colors hover:border-white/20">Ask</div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2 py-3 font-semibold text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]">Reveal</div>
              </div>
              <div className="mt-4 rounded-lg border border-white/[0.06] bg-slate-950/80 p-3 text-sm leading-6 text-slate-300 shadow-inner">
                Built for quick storytelling: metadata, chart, answer, and insights in one flow.
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <UploadBox onUpload={handleUpload} isLoading={isUploading} />

            {isUploading ? <LoadingState label="Profiling your CSV..." /> : null}
            <ErrorAlert message={error} />

            {dataset ? (
              <>
                <SummaryCards dataset={dataset} />
                <DataPreview dataset={dataset} onReset={resetDataset} />
              </>
            ) : (
              <section className="rounded-lg border border-dashed border-white/15 bg-slate-950/30 p-8 text-center shadow-card backdrop-blur transition-all hover:border-white/25">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  CSV
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-white">Your dataset preview will appear here</h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  DataLens shows columns, inferred types, row counts, missing values, and the first 10 rows as soon as your CSV lands.
                </p>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <AskForm disabled={!dataset || isUploading} isLoading={isAnalyzing} onAsk={handleAsk} />

            {isAnalyzing ? <LoadingState label="Building the answer and chart..." /> : null}

            {result ? (
              <>
                <section className="relative overflow-hidden rounded-lg border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-emerald-950/20 to-slate-950/80 p-5 text-white shadow-glow backdrop-blur-xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Answer
                  </div>
                  {lastQuestion ? <p className="mt-2 text-sm text-slate-300">{lastQuestion}</p> : null}
                  <p className="mt-4 text-2xl font-semibold leading-9 tracking-tight text-white">{result.answer}</p>
                </section>

                <InsightsPanel insights={result.insights} />
              </>
            ) : (
              <section className="rounded-lg border border-white/[0.08] bg-slate-950/40 p-5 shadow-card backdrop-blur">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Ready when you are</div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Answers appear here</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Once a dataset is uploaded, ask for trends, top categories, underperforming segments, or totals by group.
                </p>
              </section>
            )}
          </aside>
        </div>

        {result ? (
          <div className={`mt-6 grid gap-6 ${hasResultTable ? "lg:grid-cols-[minmax(0,1fr)_420px]" : "lg:grid-cols-1"}`}>
            <ChartRenderer chart={result.chart} />
            <ResultTable rows={result.table} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
