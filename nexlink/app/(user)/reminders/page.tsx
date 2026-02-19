"use client";

import { useEffect, useState } from "react";
import UserPage from "@/components/page/UserPage";
import { Reminder } from "@/components/tables/reminders/columns";
import {
  getReminders,
  deleteReminders,
  getUserRemindersSetting,
  updateUserRemindersSetting,
} from "@/lib/data";
import { useRouter } from "next/navigation";
import { Bell, BellOff } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/tables/DeleteConfirmDialog";
import { FiTrash2 } from "react-icons/fi";
import { ApplicationStatus } from "@/src/generated/prisma";
import { Switch } from "@/components/ui/switch";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-yellow-500" },
  APPLIED: { label: "Applied", className: "bg-emerald-500" },
  BEING_PROCESSED: { label: "Being Processed", className: "bg-orange-500" },
  WAITING_FOR_INTERVIEW: {
    label: "Waiting for Interview",
    className: "bg-purple-500",
  },
  REJECTED: { label: "Rejected", className: "bg-red-500" },
};

function formatDate(date: Date | null): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RemindersContent() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    Promise.all([getReminders(), getUserRemindersSetting()]).then(
      ([remindersData, setting]) => {
        setReminders(remindersData);
        setRemindersEnabled(setting);
        setIsLoading(false);
      },
    );
  }, []);

  const selectedCount = Object.keys(rowSelection).length;
  const selectedApplicationIds = Object.keys(rowSelection)
    .map((key) => reminders[Number(key)]?.applicationId)
    .filter(Boolean);

  const handleView = (applicationId: number) => {
    router.push(`/applications?id=${applicationId}`);
  };

  const handleDeleteConfirm = async () => {
    if (selectedApplicationIds.length > 0) {
      await deleteReminders(selectedApplicationIds as number[]);
      const data = await getReminders();
      setReminders(data);
      setRowSelection({});
      setShowDeleteConfirm(false);
    }
  };

  const toggleAll = () => {
    if (selectedCount === reminders.length) {
      setRowSelection({});
    } else {
      const newSelection: Record<string, boolean> = {};
      reminders.forEach((_, index) => {
        newSelection[index] = true;
      });
      setRowSelection(newSelection);
    }
  };

  const toggleRow = (index: number) => {
    setRowSelection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleToggleReminders = async (enabled: boolean) => {
    setRemindersEnabled(enabled);
    await updateUserRemindersSetting(enabled);
  };

  return (
    <UserPage
      title="Reminders"
      description="Upcoming application follow-up reminders"
    >
      {selectedCount > 0 && (
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRowSelection({})}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FiTrash2 className="h-4 w-4 mr-2" />
                Delete Reminders
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            {remindersEnabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {remindersEnabled ? "Reminders enabled" : "Reminders disabled"}
              </span>
              <span className="text-xs text-muted-foreground">
                {remindersEnabled
                  ? "You will receive reminder notifications"
                  : "All reminders are currently paused"}
              </span>
            </div>
          </div>
          <Switch
            checked={remindersEnabled}
            onCheckedChange={handleToggleReminders}
          />
        </div>
      )}

      {reminders.length === 0 && !isLoading ? (
        <div className="rounded-md border border-gray-200 bg-white p-8 h-180 flex items-center justify-center">
          <EmptyState
            icon={Bell}
            title="No upcoming reminders"
            description="You have no reminders due soon. Set up reminders on your applications to stay on track."
            action={{
              label: "View Applications",
              href: "/applications",
            }}
          />
        </div>
      ) : (
        <>
          <div className="rounded-md border-gray-200 border bg-white">
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="w-12">
                      <Skeleton className="h-5 w-5" />
                    </TableHead>
                    <TableHead className="w-45">
                      <Skeleton className="h-5 w-32" />
                    </TableHead>
                    <TableHead className="w-37.5">
                      <Skeleton className="h-5 w-24" />
                    </TableHead>
                    <TableHead className="w-40">
                      <Skeleton className="h-5 w-28" />
                    </TableHead>
                    <TableHead className="w-25">
                      <Skeleton className="h-5 w-20" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="h-16 border-none">
                      <TableCell className="w-12">
                        <Skeleton className="h-5 w-5" />
                      </TableCell>
                      <TableCell className="w-45">
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell className="w-37.5">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="w-40">
                        <Skeleton className="h-5 w-28" />
                      </TableCell>
                      <TableCell className="w-25">
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedCount === reminders.length &&
                          reminders.length > 0
                        }
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="w-45">Company</TableHead>
                    <TableHead className="w-37.5">Position</TableHead>
                    <TableHead className="w-40">Application Status</TableHead>
                    <TableHead className="w-25">Expires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders.map((reminder, index) => {
                    const config = statusConfig[reminder.applicationStatus];
                    return (
                      <TableRow
                        key={reminder.applicationId}
                        data-state={rowSelection[index] && "selected"}
                        className="h-16 border-y border-gray-200 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleView(reminder.applicationId)}
                      >
                        <TableCell
                          className="w-12"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={rowSelection[index] || false}
                            onCheckedChange={() => toggleRow(index)}
                            aria-label="Select row"
                          />
                        </TableCell>
                        <TableCell className="w-45 font-medium text-gray-900">
                          {reminder.companyName}
                        </TableCell>
                        <TableCell className="w-37.5">
                          {reminder.jobTitle}
                        </TableCell>
                        <TableCell className="w-40">
                          <Badge className={`${config.className} text-white`}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-25 text-muted-foreground">
                          {formatDate(reminder.expirationDate)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {Array.from({ length: 10 - reminders.length }).map(
                    (_, index) => (
                      <TableRow
                        key={`empty-${index}`}
                        className="h-16 border-y border-gray-200 hover:bg-transparent"
                      >
                        <TableCell className="w-12"></TableCell>
                        <TableCell className="w-45">&nbsp;</TableCell>
                        <TableCell className="w-37.5">&nbsp;</TableCell>
                        <TableCell className="w-40">&nbsp;</TableCell>
                        <TableCell className="w-25">&nbsp;</TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <DeleteConfirmDialog
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            onConfirm={handleDeleteConfirm}
            count={selectedCount}
          />
        </>
      )}
    </UserPage>
  );
}

export default function RemindersPage() {
  return <RemindersContent />;
}
