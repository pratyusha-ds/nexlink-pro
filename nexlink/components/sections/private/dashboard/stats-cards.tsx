import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Send, Target, XCircle } from "lucide-react";

interface StatusStat {
  name: string;
  total: number;
}

export function StatsCards({ data }: { data: StatusStat[] }) {
  const getCount = (statusName: string) =>
    data.find((s) => s.name === statusName)?.total || 0;

  const totalApps = data.reduce((acc, curr) => acc + curr.total, 0);

  const stats = [
    {
      title: "Total",
      value: totalApps.toString(),
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Applied",
      value: getCount("APPLIED").toString(),
      icon: Send,
      color: "text-[#16DB65]",
    },
    {
      title: "Interviews",
      value: getCount("WAITING FOR INTERVIEW").toString(),
      icon: Target,
      color: "text-amber-500",
    },
    {
      title: "Rejected",
      value: getCount("REJECTED").toString(),
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-gray-200 rounded-md shadow-none"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
