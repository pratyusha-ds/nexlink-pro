"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiMapPin, FiGlobe, FiMail, FiLink, FiCalendar } from "react-icons/fi";
import { updateApplication } from "@/lib/actions/application";
import { Switch } from "@/components/ui/switch";

interface ApplicationEditModalProps {
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
    logoUrl?: string | null;
    enableReminder?: boolean;
    reminderInterval?: number;
    expirationDate?: Date | null;
  } | null;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPLIED", label: "Applied" },
  { value: "BEING_PROCESSED", label: "Being Processed" },
  { value: "WAITING_FOR_INTERVIEW", label: "Waiting for Interview" },
  { value: "REJECTED", label: "Rejected" },
];

const typeOptions = [
  { value: "REGULAR", label: "Regular" },
  { value: "INTERNSHIP", label: "Internship" },
];

const modeOptions = [
  { value: "REMOTE", label: "Remote" },
  { value: "ON_SITE", label: "On Site" },
  { value: "HYBRID", label: "Hybrid" },
];

const allIntervalOptions = [
  { value: "1", label: "1 day before", days: 1 },
  { value: "2", label: "2 days before", days: 2 },
  { value: "3", label: "3 days before", days: 3 },
  { value: "5", label: "5 days before", days: 5 },
  { value: "7", label: "7 days before", days: 7 },
  { value: "14", label: "14 days before", days: 14 },
];

function getDaysUntilExpiration(expirationDate: string): number {
  if (!expirationDate) return 0;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiration = new Date(expirationDate);
  expiration.setHours(0, 0, 0, 0);
  
  return Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getValidIntervals(expirationDate: string): typeof allIntervalOptions {
  const daysUntil = getDaysUntilExpiration(expirationDate);
  return allIntervalOptions.filter(opt => opt.days < daysUntil);
}

function calculateDefaultInterval(expirationDate: string): number {
  const daysUntil = getDaysUntilExpiration(expirationDate);
  
  if (daysUntil <= 4) return 1;
  if (daysUntil <= 6) return 2;
  if (daysUntil <= 8) return 3;
  if (daysUntil <= 15) return 5;
  return 7;
}

function isValidForReminder(expirationDate: string): boolean {
  return getDaysUntilExpiration(expirationDate) >= 3;
}

function getMinDate(): string {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  return minDate.toISOString().split("T")[0];
}

export function ApplicationEditModal({
  open,
  onOpenChange,
  application,
  onSuccess,
}: ApplicationEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    status: "",
    type: "",
    mode: "",
    website: "",
    jobUrl: "",
    description: "",
    email: "",
    location: "",
    notes: "",
    enableReminder: false,
    reminderInterval: 3,
    expirationDate: "",
  });

  useEffect(() => {
    if (application) {
      setFormData({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        status: application.status,
        type: application.type,
        mode: application.mode,
        website: application.website ?? "",
        jobUrl: application.jobUrl ?? "",
        description: application.description ?? "",
        email: application.email ?? "",
        location: application.location ?? "",
        notes: application.notes ?? "",
        enableReminder: application.enableReminder ?? false,
        reminderInterval: application.reminderInterval ?? 3,
        expirationDate: application.expirationDate
          ? new Date(application.expirationDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [application]);

  if (!application) return null;

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setFormData({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        status: application.status,
        type: application.type,
        mode: application.mode,
        website: application.website ?? "",
        jobUrl: application.jobUrl ?? "",
        description: application.description ?? "",
        email: application.email ?? "",
        location: application.location ?? "",
        notes: application.notes ?? "",
        enableReminder: application.enableReminder ?? false,
        reminderInterval: application.reminderInterval ?? 3,
        expirationDate: application.expirationDate
          ? new Date(application.expirationDate).toISOString().split("T")[0]
          : "",
      });
    }
    onOpenChange(isOpen);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateApplication(application.id, {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        status: formData.status as any,
        type: formData.type as any,
        mode: formData.mode as any,
        website: formData.website || undefined,
        jobUrl: formData.jobUrl || undefined,
        description: formData.description || undefined,
        email: formData.email || undefined,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        enableReminder: formData.enableReminder,
        reminderInterval: formData.reminderInterval,
        expirationDate: formData.expirationDate
          ? new Date(formData.expirationDate)
          : null,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update application:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExpirationDateChange = (value: string) => {
    const newFormData = { ...formData, expirationDate: value };
    
    if (value && formData.enableReminder) {
      if (!isValidForReminder(value)) {
        newFormData.enableReminder = false;
        newFormData.reminderInterval = 3;
      } else {
        const validIntervals = getValidIntervals(value);
        const currentInterval = formData.reminderInterval;
        const isValid = validIntervals.some(opt => opt.days === currentInterval);
        
        if (!isValid && validIntervals.length > 0) {
          newFormData.reminderInterval = validIntervals[validIntervals.length - 1].days;
        }
      }
    }
    
    setFormData(newFormData);
  };

  const handleEnableReminderChange = (enabled: boolean) => {
    if (enabled && !isValidForReminder(formData.expirationDate)) {
      return;
    }
    
    const newFormData = { ...formData, enableReminder: enabled };
    
    if (enabled && formData.expirationDate) {
      newFormData.reminderInterval = calculateDefaultInterval(formData.expirationDate);
    }
    
    setFormData(newFormData);
  };

  const canEnableReminder = isValidForReminder(formData.expirationDate);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent
        className="sm:max-w-125 md:max-w-200 w-full max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 border-gray-200 shadow-none drop-shadow-none"
        showCloseButton={false}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Edit Application</DialogTitle>
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
            <div className="flex-1 min-w-0 space-y-3">
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="text-lg font-semibold shadow-none border-gray-200"
                placeholder="Company Name"
              />
              <Input
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                className="text-lg font-semibold shadow-none border-gray-200"
                placeholder="Job Title"
              />
              <div className="flex flex-wrap gap-1.5">
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="w-35 h-8 shadow-none border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="w-25 h-8 shadow-none border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.mode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mode: value })
                  }
                >
                  <SelectTrigger className="w-25 h-8 shadow-none border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50">
              <FiMapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Location"
                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50">
              <FiGlobe className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="Website"
                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50 col-span-2">
              <FiMail className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Description
            </h4>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Job description"
              className="resize-none h-24 shadow-none border-gray-200"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200">
            <FiLink className="w-4 h-4 text-muted-foreground" />
            <Input
              value={formData.jobUrl}
              onChange={(e) =>
                setFormData({ ...formData, jobUrl: e.target.value })
              }
              placeholder="Job URL"
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 shadow-none"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Reminder</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50">
                <FiCalendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  type="date"
                  min={getMinDate()}
                  value={formData.expirationDate}
                  onChange={(e) => handleExpirationDateChange(e.target.value)}
                  className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Enable</p>
                  {!canEnableReminder && formData.expirationDate && (
                    <p className="text-xs text-muted-foreground">Min 3 days</p>
                  )}
                </div>
                <Switch
                  checked={formData.enableReminder}
                  onCheckedChange={handleEnableReminderChange}
                  disabled={!canEnableReminder}
                />
              </div>
            </div>
            {formData.enableReminder && (
              <Select
                value={String(formData.reminderInterval)}
                onValueChange={(value) =>
                  setFormData({ ...formData, reminderInterval: Number(value) })
                }
              >
                <SelectTrigger className="w-full shadow-none border-gray-200">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  {getValidIntervals(formData.expirationDate).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Notes</h4>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add notes..."
              className="resize-none h-24 shadow-none border-gray-200"
            />
          </div>
        </div>

        <Separator className="bg-gray-200" />

        <div className="p-4 flex justify-end gap-2 bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
