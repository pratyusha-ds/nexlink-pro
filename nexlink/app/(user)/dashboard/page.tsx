import { StatusPie } from "@/components/sections/private/dashboard/status-pie-chart";
import { WorkTypeBar } from "@/components/sections/private/dashboard/work-type-chart";
import { StatsCards } from "@/components/sections/private/dashboard/stats-cards";
import {
  getRecentApplications,
  getStatusStats,
  getTypeStats,
} from "@/lib/data";
import UserPage from "@/components/page/UserPage";
import {
  Building2,
  ArrowRight,
  Briefcase,
  PieChart,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

const statusColorMap: Record<string, string> = {
  APPLIED: "bg-emerald-500",
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
    <UserPage title="Dashboard">
      <div className="space-y-8">
        <StatsCards data={statusStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-md border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Status Overview
                </h3>
                {statusStats.length > 0 ? (
                  <StatusPie data={statusStats} />
                ) : (
                  <EmptyState
                    icon={PieChart}
                    title="No data yet"
                    description="Your application status will appear here."
                  />
                )}
              </div>
              <div className="bg-white rounded-md border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Work Preferences
                </h3>
                {typeStats.length > 0 ? (
                  <WorkTypeBar data={typeStats} />
                ) : (
                  <EmptyState
                    icon={BarChart3}
                    title="No data yet"
                    description="Your work type preferences will appear here."
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Recent Applications
              </h3>
              {recentApps.length > 0 && (
                <Link
                  href="/applications/create"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            {recentApps.length > 0 ? (
              <div className="space-y-1">
                {recentApps.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        statusColorMap[app.status] || "bg-gray-400"
                      }`}
                    />
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {app.companyName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 shrink-0">
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No applications yet"
                description="Start tracking your job applications to see them here."
                action={{
                  label: "Add Application",
                  href: "/applications/create",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </UserPage>
  );
}
