"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusDropdown, StatusBadge } from "./StatusDropdown";
import {
  FiMapPin,
  FiGlobe,
  FiMail,
  FiCalendar,
  FiLink,
  FiEdit,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";
import { MdAttachMoney } from "react-icons/md";

interface ApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: {
    id: number;
    jobTitle: string;
    companyName: string;
    status: string;
    type: string;
    mode: string;
    notes: string | null;
    interviewDnT: Date | null;
    website?: string | null;
    jobUrl?: string | null;
    description?: string | null;
    email?: string | null;
    location?: string | null;
    salary?: string | null;
    logoUrl?: string | null;
  } | null;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  APPLIED: {
    label: "Applied",
    className: "bg-[#16db65] hover:bg-[#14c259] text-white",
  },
  BEING_PROCESSED: {
    label: "Being Processed",
    className: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  WAITING_FOR_INTERVIEW: {
    label: "Waiting for Interview",
    className: "bg-purple-500 hover:bg-purple-600 text-white",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-500 hover:bg-red-600 text-white",
  },
};

const typeLabels: Record<string, string> = {
  REGULAR: "Regular",
  INTERNSHIP: "Internship",
};

const modeLabels: Record<string, string> = {
  REMOTE: "Remote",
  ON_SITE: "On Site",
  HYBRID: "Hybrid",
};

export function ApplicationDetailModal({
  open,
  onOpenChange,
  application,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-125 md:max-w-200 w-full max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 border-gray-200 shadow-none drop-shadow-none"
        showCloseButton={false}
      >
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {application.logoUrl ? (
              <img
                src={application.logoUrl}
                alt={`${application.companyName} logo`}
                className="w-14 h-14 rounded-xl object-contain border bg-white p-1"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border">
                <span className="text-2xl font-bold text-primary">
                  {application.companyName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold leading-tight">
                {application.jobTitle}
              </DialogTitle>
              <p className="text-muted-foreground font-medium mt-1">
                {application.companyName}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {onStatusChange ? (
                  <StatusDropdown
                    status={application.status}
                    onStatusChange={(status) =>
                      onStatusChange(application.id, status)
                    }
                  />
                ) : (
                  <StatusBadge status={application.status} />
                )}
                <Badge variant="secondary" className="font-medium">
                  {typeLabels[application.type] || application.type}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {modeLabels[application.mode] || application.mode}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
          {(application.location ||
            application.website ||
            application.salary) && (
              <div className="grid grid-cols-2 gap-3">
                {application.location && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50">
                    <FiMapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{application.location}</span>
                  </div>
                )}
                {application.website && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50">
                    <FiGlobe className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{application.website}</span>
                  </div>
                )}
                {application.salary && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50">
                    <MdAttachMoney className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{application.salary}</span>
                  </div>
                )}
                {application.email && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50 col-span-2">
                    <FiMail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{application.email}</span>
                  </div>
                )}
              </div>
            )}

          {application.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Description
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {application.description}
              </p>
            </div>
          )}

          {application.interviewDnT && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Interview Schedule
              </h4>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 border border-purple-100">
                <FiCalendar className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-sm text-purple-700 font-medium">
                  {new Date(application.interviewDnT).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </div>
            </div>
          )}

          {application.jobUrl && (
            <div className="flex items-center gap-2">
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FiLink className="w-4 h-4" />
                View Job Posting
                <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {application.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Notes</h4>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {application.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-200" />

        <div className="p-4 flex justify-between gap-2 bg-muted/30">
          {onDelete && (
            <Button
              variant="destructive"
              onClick={() => onDelete(application.id)}
              className="gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(application.id)} className="gap-2">
                <FiEdit className="w-4 h-4" />
                Edit Application
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
