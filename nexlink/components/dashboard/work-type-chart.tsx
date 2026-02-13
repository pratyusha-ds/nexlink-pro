"use client";

import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg">Work Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-4/3 w-full">
          <BarChart data={data} margin={{ top: 20 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.replace("_", " ")}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
