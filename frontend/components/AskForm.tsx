"use client";

import { FormEvent, useState } from "react";

type AskFormProps = {
  disabled: boolean;
  isLoading: boolean;
  onAsk: (question: string) => void;
};

const EXAMPLES = [
  "Which category has the highest sales?",
  "Show me revenue over time",
  "What are the top 5 regions?",
  "Which segment is underperforming?"
];

export default function AskForm({ disabled, isLoading, onAsk }: AskFormProps) {
  const [question, setQuestion] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || disabled || isLoading) {
      return;
    }
    onAsk(trimmed);
  }

  return (
    <section className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">Ask your data anything</h2>
        <p className="mt-1 text-sm text-slate-400">Use plain English. DataLens turns your question into safe analysis steps.</p>
      </div>

      <form onSubmit={submit} className="flex gap-3">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={disabled || isLoading}
          placeholder={disabled ? "Upload a CSV first" : "Which month had the highest sales?"}
          className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-400/10 disabled:border-white/[0.04] disabled:bg-white/[0.02] disabled:text-slate-600"
        />
        <button
          type="submit"
          disabled={disabled || isLoading || !question.trim()}
          className="rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all hover:from-emerald-300 hover:to-teal-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none"
        >
          {isLoading ? "Analyzing..." : "Ask"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            disabled={disabled || isLoading}
            onClick={() => {
              setQuestion(example);
              onAsk(example);
            }}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200 hover:shadow-[0_0_12px_rgba(16,185,129,0.15)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}
