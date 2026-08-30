"use client";

import { useState } from "react";

import AskForm from "@/components/AskForm";
import ChartRenderer from "@/components/ChartRenderer";
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
        <header className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 p-6 shadow-glow backdrop-blur lg:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white lg:text-7xl">
              DataLens
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Ask your data anything. Upload a CSV, get a fast answer, see the chart, and walk away with the story.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">CSV preview</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">AI analysis plan</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Charts and insights</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-soft lg:w-80">
            <div className="text-sm font-semibold text-white">Fast analysis flow</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-medium text-slate-300">
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-3">Upload</div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-3">Ask</div>
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/15 px-2 py-3 text-emerald-100">Reveal</div>
            </div>
            <div className="mt-4 rounded-lg bg-slate-950/70 p-3 text-sm leading-6 text-slate-300">
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
              <section className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center shadow-soft backdrop-blur">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-emerald-200">
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
                <section className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-white shadow-glow">
                  <div className="text-xs font-medium uppercase tracking-wide text-emerald-200">Answer</div>
                  {lastQuestion ? <p className="mt-2 text-sm text-slate-300">{lastQuestion}</p> : null}
                  <p className="mt-4 text-2xl font-semibold leading-9 tracking-tight text-white">{result.answer}</p>
                </section>

                <InsightsPanel insights={result.insights} />
              </>
            ) : (
              <section className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-soft backdrop-blur">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Ready when you are</div>
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
