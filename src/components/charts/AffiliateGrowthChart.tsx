"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const DATA = [
  { year: "2022", affiliates: 11 },
  { year: "2023", affiliates: 13 },
  { year: "2024", affiliates: 16 },
  { year: "2025", affiliates: 19 },
  { year: "2026", affiliates: 24 },
];

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
      <p style={{ color: "#9BEC00", fontWeight: 800, marginBottom: 4 }}>ปี {label}</p>
      <p style={{ color: "#fff", fontWeight: 600 }}>{payload[0].value} <span style={{ color: "#aaa" }}>Affiliates</span></p>
    </div>
  );
}

export default function AffiliateGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={DATA} margin={{ top: 20, right: 16, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#888", fontWeight: 600 }}
          axisLine={{ stroke: "#ccc" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#999" }}
          axisLine={false}
          tickLine={false}
          domain={[8, 26]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="affiliates"
          stroke="#9BEC00"
          strokeWidth={2.5}
          dot={{ fill: "#9BEC00", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#9BEC00", stroke: "#111", strokeWidth: 2 }}
        >
          <LabelList
            dataKey="affiliates"
            position="top"
            style={{ fontSize: 10, fontWeight: 700, fill: "#555" }}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}
