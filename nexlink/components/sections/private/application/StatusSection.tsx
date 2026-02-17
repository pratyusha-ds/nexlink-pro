import { UseFormReturn } from "react-hook-form";
import { type ApplicationFormValues } from "@/lib/validations/application";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StatusSection({
  form,
}: {
  form: UseFormReturn<ApplicationFormValues>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Application Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="BEING_PROCESSED">
                    Being Processed
                  </SelectItem>
                  <SelectItem value="WAITING_FOR_INTERVIEW">
                    Waiting for Interview
                  </SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Mode</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="ON_SITE">On Site</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
