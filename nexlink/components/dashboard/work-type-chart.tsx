"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { type: "REMOTE", count: 24 },
  { type: "HYBRID", count: 12 },
  { type: "ON_SITE", count: 5 },
];

const chartConfig = {
  count: { label: "Applications", color: "#16DB65" },
} satisfies ChartConfig;

export function WorkTypeBar() {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg">Work Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-4/3 w-full">
          <BarChart data={chartData} margin={{ top: 20 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <XAxis
              dataKey="type"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.replace("_", " ")}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
