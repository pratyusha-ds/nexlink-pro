"use client";

import { Bar, BarChart, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  value: { label: "Applications", color: "#3b82f6" },
} satisfies ChartConfig;

interface WorkModeData {
  name: string;
  value: number;
}

export function WorkModeChart({ data }: { data: WorkModeData[] }) {
  const formattedData = data.map((item) => ({
    name: item.name
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()),
    value: item.value,
  }));

  return (
    <div className="flex flex-col">
      <ChartContainer config={chartConfig} className="w-full h-80">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ left: 10, right: 10 }}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            opacity={0.4}
          />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={70}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[0, 4, 4, 0]}
            barSize={24}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
