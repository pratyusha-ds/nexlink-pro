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

const chartConfig = {
  total: { label: "Apps" },
  APPLIED: { label: "Applied", color: "#16DB65" },
  BEING_PROCESSED: { label: "Processing", color: "#3b82f6" },
  WAITING_FOR_INTERVIEW: { label: "Interviews", color: "#f59e0b" },
  REJECTED: { label: "Rejected", color: "#ef4444" },
  PENDING: { label: "Pending", color: "#94a3b8" },
} satisfies ChartConfig;

export function StatusPie({ data }: { data: any[] }) {
  const formattedData = data.map((item) => {
    const configKey = item.name.replace(/\s+/g, "_");
    const configEntry = chartConfig[configKey as keyof typeof chartConfig];

    return {
      status: configKey,
      total: item.total,
      fill:
        configEntry && "color" in configEntry ? configEntry.color : "#94a3b8",
    };
  });

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
              data={formattedData}
              dataKey="total"
              nameKey="status"
              innerRadius={40}
              strokeWidth={5}
            >
              {formattedData.map((entry, index) => (
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
