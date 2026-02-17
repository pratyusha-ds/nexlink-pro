"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

import {
  applicationSchema,
  type ApplicationFormValues,
} from "@/lib/validations/application";

import { createApplication, updateApplication } from "@/lib/actions/application";

import CompanySection from "./CompanySection";
import StatusSection from "./StatusSection";

interface ApplicationFormProps {
  defaultValues?: Partial<ApplicationFormValues>;
  id?: number;
}

export default function ApplicationForm({ defaultValues, id }: ApplicationFormProps) {
  const router = useRouter();

  const isEditMode = !!id;
  
  const searchParams = useSearchParams();
  const company = searchParams.get("company") || "";
  const title = searchParams.get("title") || "";
  const location = searchParams.get("location") || "";
  const jobUrl = searchParams.get("url") || "";


  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      companyName: company,
      jobTitle: title,
      location: location,
      description: jobUrl ? `Source: ${jobUrl}` : "",
      email: "",
      status: "PENDING",
      type: "REGULAR",
      mode: "REMOTE",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (company || title) {
      form.setValue("companyName", company);
      form.setValue("jobTitle", title);
      form.setValue("location", location);
      if (jobUrl) form.setValue("description", `Source: ${jobUrl}`);
    }
  }, [company, title, location, jobUrl, form]);

  async function onSubmit(values: ApplicationFormValues) {
    try {
      if (isEditMode && id) {
        await updateApplication(id, values);
        router.refresh();
      } else {
        await createApplication(values);
        router.push("/applications");
      }
    } catch (error) {
      console.error(isEditMode ? "Failed to update application:" : "Failed to create application:", error);
    }
  }

  return (
    <Card className="border-gray-200 shadow-none rounded-md">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {isEditMode ? "Update Application" : "Save Application"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
