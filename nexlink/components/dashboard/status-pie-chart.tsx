"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { status: "APPLIED", count: 15, fill: "var(--color-APPLIED)" },
  { status: "BEING_PROCESSED", count: 8, fill: "var(--color-BEING_PROCESSED)" },
  {
    status: "WAITING_FOR_INTERVIEW",
    count: 4,
    fill: "var(--color-WAITING_FOR_INTERVIEW)",
  },
  { status: "REJECTED", count: 10, fill: "var(--color-REJECTED)" },
  { status: "PENDING", count: 5, fill: "var(--color-PENDING)" },
];

const chartConfig = {
  count: { label: "Apps" },
  APPLIED: { label: "Applied", color: "#16DB65" },
  BEING_PROCESSED: { label: "Processing", color: "#3b82f6" },
  WAITING_FOR_INTERVIEW: { label: "Interviews", color: "#f59e0b" },
  REJECTED: { label: "Rejected", color: "#ef4444" },
  PENDING: { label: "Pending", color: "#94a3b8" },
} satisfies ChartConfig;

export function StatusPie() {
  return (
    <Card className="flex flex-col border-none shadow-none bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Application Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-75"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={40}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
