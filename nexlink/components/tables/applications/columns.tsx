"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { StatusDropdown } from "../StatusDropdown";

export type Application = {
  id: number;
  jobTitle: string;
  companyName: string;
  status: status;
  type: type;
  mode: mode;
  notes: string | null;
  interviewDnT: Date | null;
  website?: string | null;
  jobUrl?: string | null;
  description?: string | null;
  email?: string | null;
  location?: string | null;
  salary?: string | null;
  logoUrl?: string | null;
};

export type status =
  | "PENDING"
  | "APPLIED"
  | "BEING_PROCESSED"
  | "WAITING_FOR_INTERVIEW"
  | "REJECTED";
export type mode = "REMOTE" | "ON_SITE" | "HYBRID";
export type type = "REGULAR" | "INTERNSHIP";

function formatType(type: type) {
  const typeLabels = {
    REGULAR: "Regular",
    INTERNSHIP: "Internship",
  };

  return <span className="text-muted-foreground">{typeLabels[type]}</span>;
}

function formatMode(mode: mode) {
  const modeLabels = {
    REMOTE: "Remote",
    ON_SITE: "On Site",
    HYBRID: "Hybrid",
  };

  return <span className="text-muted-foreground">{modeLabels[mode]}</span>;
}

export const getColumns = (
  onStatusChange?: (id: number, status: string) => void,
): ColumnDef<Application>[] => [
    {
      accessorKey: "jobTitle",
      header: "Position",
      size: 100,
      meta: {
        className: "w-[100px]",
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => {
        const notes = row.original.notes;
        const companyName = row.getValue("companyName") as string;

        if (notes) {
          return (
            <div className="flex items-center gap-2">
              <span>{companyName}</span>
            </div>
          );
        }

        return <span>{companyName}</span>;
      },
      meta: {
        className: "w-[200px]",
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (onStatusChange) {
          return (
            <StatusDropdown
              status={status}
              onStatusChange={(newStatus) =>
                onStatusChange(row.original.id, newStatus)
              }
            />
          );
        }
        const statusConfig = {
          PENDING: {
            label: "Pending",
            className: "bg-yellow-500 hover:bg-yellow-600",
          },
          APPLIED: {
            label: "Applied",
            className: "bg-malachite hover:bg-primary",
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
        const config = statusConfig[status as keyof typeof statusConfig] || {
          label: status,
          className: "bg-gray-100 text-gray-700",
        };
        return (
          <Badge className={`${config.className} text-white`}>
            {config.label}
          </Badge>
        );
      },
      size: 180,
      meta: {
        className: "w-[180px]",
        filterKey: "status",
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => formatType(row.getValue("type")),
      size: 100,
      meta: {
        className: "w-[100px]",
        filterKey: "type",
      },
    },
    {
      accessorKey: "mode",
      header: "Mode",
      cell: ({ row }) => formatMode(row.getValue("mode")),
      size: 100,
      meta: {
        className: "w-[100px]",
        filterKey: "mode",
      },
    },
  ];
