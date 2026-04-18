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
    <section className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-glow backdrop-blur">
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
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10 disabled:bg-white/[0.03] disabled:text-slate-500"
        />
        <button
          type="submit"
          disabled={disabled || isLoading || !question.trim()}
          className="rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
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
            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}
