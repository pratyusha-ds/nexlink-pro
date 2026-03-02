"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-500 hover:bg-yellow-600",
  },
  APPLIED: { label: "Applied", className: "bg-[#16db65] hover:bg-[#14c259]" },
  BEING_PROCESSED: {
    label: "Being Processed",
    className: "bg-orange-500 hover:bg-orange-600",
  },
  WAITING_FOR_INTERVIEW: {
    label: "Waiting for Interview",
    className: "bg-purple-500 hover:bg-purple-600",
  },
  REJECTED: { label: "Rejected", className: "bg-red-500 hover:bg-red-600" },
};

interface StatusDropdownProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export function StatusDropdown({ status, onStatusChange }: StatusDropdownProps) {
  const statusInfo = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleClick}>
      <Popover>
        <PopoverTrigger asChild>
          <Badge
            className={`${statusInfo.className} text-white border font-medium cursor-pointer hover:opacity-80`}
          >
            {statusInfo.label}
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="p-1 w-auto" align="start">
          <div className="flex flex-col gap-1">
            {Object.entries(statusConfig).map(([key, value]) => (
              <Button
                key={key}
                variant={status === key ? "secondary" : "ghost"}
                size="sm"
                className="justify-start font-normal"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(key);
                }}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${value.className}`} />
                {value.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusInfo = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <Badge className={`${statusInfo.className} text-white border font-medium`}>
      {statusInfo.label}
    </Badge>
  );
}
