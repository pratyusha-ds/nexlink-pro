"use client";

import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  value: { label: "Applications", color: "#16DB65" },
} satisfies ChartConfig;

interface WorkTypeData {
  name: string;
  value: number;
}

export function WorkTypeBar({ data }: { data: WorkTypeData[] }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={chartConfig} className="w-full h-80">
        <BarChart data={data} margin={{ top: 10 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.replace(/_/g, " ")}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
