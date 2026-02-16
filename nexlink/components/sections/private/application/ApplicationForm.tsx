"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

import {
  applicationSchema,
  type ApplicationFormValues,
} from "@/lib/validations/application";

import { createApplication } from "@/lib/actions/application";

import CompanySection from "./CompanySection";
import StatusSection from "./StatusSection";

export default function ApplicationForm() {
  const router = useRouter();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      location: "",
      description: "",
      email: "",
      status: "PENDING",
      type: "REMOTE",
    },
  });

  async function onSubmit(values: ApplicationFormValues) {
    try {
      await createApplication(values);
      router.push("/applications");
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  }

  return (
    <Card className="border-gray-200 shadow-none rounded-md">
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CompanySection form={form} />
            <StatusSection form={form} />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/applications")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                Save Application
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
