"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  applicationSchema,
  type ApplicationFormValues,
} from "@/lib/validations/application";

import CompanySection from "./CompanySection";
import StatusSection from "./StatusSection";

// TODO: add a server call for the user application
export default function ApplicationForm() {
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

  function onSubmit(values: ApplicationFormValues) {
    console.log(values);
  }

  return (
    <div className="w-full p-4 bg-white rounded-md shadow-sm border border-slate-100">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
        Application Form
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CompanySection form={form} />
          <StatusSection form={form} />
          {/* <DocumentSection form={form} /> */}

          <div className="flex items-center justify-center">
              <Button
              variant="default"
              className="self-center bg-green-700 hover:bg-green-800 text-white w-[15%] max-sm:w-full py-6"
            >
                Save Application
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
