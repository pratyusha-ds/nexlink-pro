"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ApplicationType } from "@/src/generated/prisma";

interface WorkTypeBarProps {
  data: {
    name: ApplicationType;
    value: number;
  }[];
}

const chartConfig = {
  value: { label: "Applications", color: "#16DB65" },
} satisfies ChartConfig;

export function WorkTypeBar({ data }: WorkTypeBarProps) {
  // Transform the data to match the chart format
  const chartData = data.map(item => ({
    type: item.name,
    count: item.value
  }));

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
