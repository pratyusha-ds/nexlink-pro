import { z } from "zod";

const ApplicationStatus = z.enum([
  "PENDING",
  "APPLIED",
  "BEING_PROCESSED",
  "WAITING_FOR_INTERVIEW",
  "REJECTED",
]);

const ApplicationType = z.enum(["REMOTE", "ON_SITE", "HYBRID"]);

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  status: ApplicationStatus,
  type: ApplicationType,
  website: z.url("Invalid URL").or(z.literal("")).nullable(),
  jobUrl: z.url("Invalid job link").or(z.literal("")).nullable(),
  logoUrl: z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
  email: z.email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  notes: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  interviewDnT: z.date().nullable().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
