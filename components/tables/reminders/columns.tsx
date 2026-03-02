"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ApplicationStatus } from "@/src/generated/prisma";

export type Reminder = {
  id: number;
  applicationId: number;
  companyName: string;
  jobTitle: string;
  applicationStatus: ApplicationStatus;
  interval: number;
  expirationDate: Date | null;
  lastSentAt: Date | null;
  nextSendAt: Date | null;
};

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-500 hover:bg-yellow-600",
  },
  APPLIED: {
    label: "Applied",
    className: "bg-emerald-500 hover:bg-emerald-600",
  },
  BEING_PROCESSED: {
    label: "Being Processed",
    className: "bg-orange-500 hover:bg-orange-600",
  },
  WAITING_FOR_INTERVIEW: {
    label: "Waiting for Interview",
    className: "bg-purple-500 hover:bg-purple-600",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-500 hover:bg-red-600",
  },
};

function formatInterval(interval: number): string {
  if (interval === 1) return "1 day";
  if (interval < 7) return `${interval} days`;
  if (interval === 7) return "1 week";
  const weeks = Math.floor(interval / 7);
  const days = interval % 7;
  if (days === 0) return `${weeks} week${weeks > 1 ? "s" : ""}`;
  return `${weeks}w ${days}d`;
}

function formatDate(date: Date | null): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const getColumns = (
  onToggleEnable?: (applicationId: number, enable: boolean) => void,
): ColumnDef<Reminder>[] => [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
      return (
        <span className="font-medium text-gray-900">
          {row.getValue("companyName")}
        </span>
      );
    },
    size: 180,
    meta: {
      className: "w-[180px]",
    },
  },
  {
    accessorKey: "jobTitle",
    header: "Position",
    size: 150,
    meta: {
      className: "w-[150px]",
    },
  },
  {
    accessorKey: "applicationStatus",
    header: "App Status",
    cell: ({ row }) => {
      const status = row.getValue("applicationStatus") as ApplicationStatus;
      const config = statusConfig[status];
      return (
        <Badge className={`${config.className} text-white`}>
          {config.label}
        </Badge>
      );
    },
    size: 160,
    meta: {
      className: "w-[160px]",
    },
  },
  {
    accessorKey: "expirationDate",
    header: "Expires",
    cell: ({ row }) => {
      const expirationDate = row.getValue("expirationDate") as Date | null;
      return (
        <span className="text-muted-foreground">
          {formatDate(expirationDate)}
        </span>
      );
    },
    size: 100,
    meta: {
      className: "w-[100px]",
    },
  },
  {
    accessorKey: "interval",
    header: "Interval",
    cell: ({ row }) => {
      const interval = row.getValue("interval") as number;
      return (
        <span className="text-muted-foreground">
          {formatInterval(interval)}
        </span>
      );
    },
    size: 100,
    meta: {
      className: "w-[100px]",
    },
  },
];
