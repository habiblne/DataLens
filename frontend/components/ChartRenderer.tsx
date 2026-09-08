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

const COLORS = [
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#3b82f6", // Blue
  "#14b8a6", // Teal
  "#ec4899"  // Pink
];

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.9)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "8px",
  boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.6)",
  color: "#f8fafc",
  padding: "8px 12px"
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
    <section className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {chart.type} chart
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">{chart.title}</h2>
        </div>
      </div>

      <div className="h-80 w-full">
        {!hasData ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-sm text-slate-400">
            No chart data returned.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === "line" ? (
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey={chart.xKey} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }} width={54} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1", fontWeight: 600 }} />
                <Line
                  type="monotone"
                  dataKey={chart.yKey}
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#030712" }}
                  activeDot={{ r: 6, fill: "#34d399", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </LineChart>
            ) : chart.type === "area" ? (
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey={chart.xKey} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }} width={54} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1", fontWeight: 600 }} />
                <Area
                  type="monotone"
                  dataKey={chart.yKey}
                  stroke="#06b6d4"
                  fill="url(#areaGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            ) : chart.type === "pie" ? (
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1", fontWeight: 600 }} />
                <Pie
                  data={data}
                  dataKey={chart.yKey}
                  nameKey={chart.xKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={48}
                  paddingAngle={3}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="rgba(3, 7, 18, 0.6)" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
                <XAxis dataKey={chart.xKey} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }} width={54} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1", fontWeight: 600 }} />
                <Bar dataKey={chart.yKey} fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
