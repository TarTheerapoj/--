"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface Props {
  data: { label: string; count: number }[];
}

function getBarColor(value: number, max: number): string {
  const t = max > 0 ? value / max : 0;
  if (t >= 0.85) return "#9BEC00";
  if (t >= 0.65) return "#7acc00";
  if (t >= 0.45) return "#5aaa00";
  if (t >= 0.25) return "#3d7a00";
  return "#254d00";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "#111",
      border: "1px solid #9BEC00",
      borderRadius: 6,
      padding: "8px 14px",
      fontSize: 12,
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    }}>
      <p style={{ color: "#9BEC00", fontWeight: 800, marginBottom: 4, letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ color: "#fff", fontWeight: 600 }}>{payload[0].value} <span style={{ color: "#aaa" }}>คน</span></p>
    </div>
  );
}

export default function ScoreDistributionChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 20, right: 4, left: -24, bottom: 0 }} barSize={28} barCategoryGap="20%">
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "#666", fontWeight: 600 }}
          axisLine={{ stroke: "#bbb" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#999" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.06)", radius: 4 }} />
        <Bar dataKey="count" radius={[5, 5, 0, 0]}>
          <LabelList
            dataKey="count"
            position="top"
            style={{ fontSize: 10, fontWeight: 700, fill: "#555" }}
          />
          {data.map((entry, i) => (
            <Cell key={i} fill={getBarColor(entry.count, max)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
