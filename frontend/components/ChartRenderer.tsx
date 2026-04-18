"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { ChartConfig } from "@/lib/types";

type ChartRendererProps = {
  chart: ChartConfig;
};

const COLORS = ["#059669", "#2563eb", "#f97316", "#dc2626", "#7c3aed", "#0891b2", "#ca8a04", "#db2777"];
const tooltipStyle = {
  backgroundColor: "#020617",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "8px",
  color: "#f8fafc"
};

export default function ChartRenderer({ chart }: ChartRendererProps) {
  const data = chart.data
    .map((row) => {
      const rawValue = row[chart.yKey];
      const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

      return {
        ...row,
        [chart.xKey]: row[chart.xKey] === null || row[chart.xKey] === undefined ? "N/A" : String(row[chart.xKey]),
        [chart.yKey]: Number.isFinite(numericValue) ? numericValue : 0
      };
    })
    .filter((row) => row[chart.xKey] !== "");
  const hasData = data.length > 0;

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-soft backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-emerald-300">{chart.type} chart</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">{chart.title}</h2>
        </div>
      </div>

      <div className="h-80 w-full">
        {!hasData ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-slate-400">
            No chart data returned.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === "line" ? (
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={chart.xKey} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} width={54} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} />
                <Line type="monotone" dataKey={chart.yKey} stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : chart.type === "area" ? (
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={chart.xKey} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} width={54} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} />
                <Area type="monotone" dataKey={chart.yKey} stroke="#38bdf8" fill="#0e7490" strokeWidth={3} />
              </AreaChart>
            ) : chart.type === "pie" ? (
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} />
                <Pie
                  data={data}
                  dataKey={chart.yKey}
                  nameKey={chart.xKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={48}
                  paddingAngle={2}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey={chart.xKey} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} width={54} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} />
                <Bar dataKey={chart.yKey} fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
