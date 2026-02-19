"use client";

import { UseFormReturn } from "react-hook-form";
import { type ApplicationFormValues } from "@/lib/validations/application";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell } from "lucide-react";

const allIntervalOptions = [
  { value: "1", label: "1 day before", days: 1 },
  { value: "2", label: "2 days before", days: 2 },
  { value: "3", label: "3 days before", days: 3 },
  { value: "5", label: "5 days before", days: 5 },
  { value: "7", label: "7 days before", days: 7 },
  { value: "14", label: "14 days before", days: 14 },
];

function getDaysUntilExpiration(expirationDate: Date | null | undefined): number {
  if (!expirationDate) return 0;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiration = new Date(expirationDate);
  expiration.setHours(0, 0, 0, 0);
  
  return Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getValidIntervals(expirationDate: Date | null | undefined): typeof allIntervalOptions {
  const daysUntil = getDaysUntilExpiration(expirationDate);
  return allIntervalOptions.filter(opt => opt.days < daysUntil);
}

function calculateDefaultInterval(expirationDate: Date | null | undefined): number {
  const daysUntil = getDaysUntilExpiration(expirationDate);
  
  if (daysUntil <= 4) return 1;
  if (daysUntil <= 6) return 2;
  if (daysUntil <= 8) return 3;
  if (daysUntil <= 15) return 5;
  return 7;
}

function isValidForReminder(expirationDate: Date | null | undefined): boolean {
  return getDaysUntilExpiration(expirationDate) >= 3;
}

function getMinDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  return tomorrow.toISOString().split("T")[0];
}

export default function ReminderSection({
  form,
}: {
  form: UseFormReturn<ApplicationFormValues>;
}) {
  const enableReminder = form.watch("enableReminder");
  const expirationDate = form.watch("expirationDate");

  const handleExpirationDateChange = (value: string) => {
    const date = value ? new Date(value) : null;
    form.setValue("expirationDate", date);
    
    if (date && enableReminder) {
      if (!isValidForReminder(date)) {
        form.setValue("enableReminder", false);
        form.setValue("reminderInterval", 3);
      } else {
        const validIntervals = getValidIntervals(date);
        const currentInterval = form.getValues("reminderInterval");
        const isValid = validIntervals.some(opt => opt.days === currentInterval);
        
        if (!isValid && validIntervals.length > 0) {
          form.setValue("reminderInterval", validIntervals[validIntervals.length - 1].days);
        }
      }
    }
  };

  const handleEnableReminderChange = (enabled: boolean) => {
    if (enabled && !isValidForReminder(expirationDate)) {
      return;
    }
    
    form.setValue("enableReminder", enabled);
    
    if (enabled && expirationDate) {
      const defaultInterval = calculateDefaultInterval(expirationDate);
      form.setValue("reminderInterval", defaultInterval);
    }
  };

  const canEnableReminder = isValidForReminder(expirationDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Reminders</h3>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={getMinDate()}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleExpirationDateChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enableReminder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder</FormLabel>
                <FormControl>
                  <div className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-3 h-[38px]">
                    <span className="text-sm">{field.value ? "On" : "Off"}</span>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={handleEnableReminderChange}
                      disabled={!canEnableReminder}
                    />
                  </div>
                </FormControl>
                {!canEnableReminder && expirationDate && (
                  <p className="text-xs text-muted-foreground">
                    Requires at least 3 days notice
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        {enableReminder && (
          <FormField
            control={form.control}
            name="reminderInterval"
            render={({ field }) => {
              const validIntervals = getValidIntervals(expirationDate);
              return (
                <FormItem>
                  <FormLabel>Notify Me</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value ?? 3)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {validIntervals.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
