import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Send, Target, XCircle } from "lucide-react";

const stats = [
  {
    title: "Total",
    value: "42",
    change: "+5",
    icon: Briefcase,
    color: "text-blue-600",
  },
  {
    title: "Applied",
    value: "15",
    change: "+12",
    icon: Send,
    color: "text-[#16DB65]",
  },
  {
    title: "Interviews",
    value: "4",
    change: "+1",
    icon: Target,
    color: "text-amber-500",
  },
  {
    title: "Rejected",
    value: "10",
    change: "+2",
    icon: XCircle,
    color: "text-red-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change} from last week
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
