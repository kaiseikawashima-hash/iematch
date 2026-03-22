"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { RadarValues } from "@/types";

type Props = {
  readonly values: RadarValues;
};

const axisLabels: Record<string, string> = {
  design: "デザイン",
  performance: "性能",
  cost: "コスパ",
  lifestyle: "暮らし",
  trust: "安心・信頼",
};

export function RadarChart({ values }: Props) {
  const data = Object.entries(values).map(([key, value]) => ({
    subject: axisLabels[key] ?? key,
    value,
    fullMark: 100,
  }));

  return (
    <div className="mx-auto h-64 w-full max-w-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#374151", fontSize: 11 }}
          />
          <Radar
            name="バランス"
            dataKey="value"
            stroke="#2E5240"
            fill="#2E5240"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
