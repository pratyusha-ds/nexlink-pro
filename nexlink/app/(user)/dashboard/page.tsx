import { StatusPie } from "@/components/dashboard/status-pie-chart";
import { WorkTypeBar } from "@/components/dashboard/work-type-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";

const recentActivities = [
  {
    id: 1,
    title: "Applied to Google",
    desc: "Software Engineer • 2 hours ago",
    color: "bg-[#16DB65]",
  },
  {
    id: 2,
    title: "Moved to 'Interviewing'",
    desc: "Meta • 5 hours ago",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Applied to Amazon",
    desc: "Frontend Developer • Yesterday",
    color: "bg-[#16DB65]",
  },
  {
    id: 4,
    title: "Application Rejected",
    desc: "Netflix • 2 days ago",
    color: "bg-red-500",
  },
  {
    id: 5,
    title: "Added interview notes",
    desc: "Apple • 3 days ago",
    color: "bg-amber-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="pt-24 py-4 md:pt-10 px-6 space-y-4">
      <h1 className="text-xl md:text-3xl font-bold">Dashboard</h1>

      <StatsCards />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusPie />
        <WorkTypeBar />
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`mt-1.5 h-2 w-2 rounded-full ${activity.color}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
