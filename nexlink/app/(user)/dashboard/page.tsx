import { StatusPie } from "@/components/dashboard/status-pie-chart";
import { WorkTypeBar } from "@/components/dashboard/work-type-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import {
  getRecentApplications,
  getStatusStats,
  getTypeStats,
} from "@/lib/data";

const statusColorMap: Record<string, string> = {
  APPLIED: "bg-[#16DB65]",
  BEING_PROCESSED: "bg-blue-500",
  WAITING_FOR_INTERVIEW: "bg-amber-500",
  REJECTED: "bg-red-500",
  PENDING: "bg-slate-400",
};

export default async function DashboardPage() {
  const [recentApps, statusStats, typeStats] = await Promise.all([
    getRecentApplications(),
    getStatusStats(),
    getTypeStats(),
  ]);

  return (
    <div className="pt-24 py-4 md:pt-10 px-6 space-y-4">
      <h1 className="text-xl md:text-3xl font-bold">Dashboard</h1>

      <StatsCards data={statusStats} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusPie data={statusStats} />
        <WorkTypeBar data={typeStats} />
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentApps.map((app) => (
              <div key={app.id} className="flex items-start gap-3">
                <div
                  className={`mt-1.5 h-2 w-2 rounded-full ${statusColorMap[app.status] || "bg-gray-400"}`}
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Applied to {app.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.jobTitle} •{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
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
