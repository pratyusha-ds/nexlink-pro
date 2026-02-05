import { z } from "zod";

export const applicationSchema = z.object({
  //Job Details for the company applied to
  companyName: z.string({ error: "Company name is required" }).min(1),
  website: z.url({ error: "Please enter a valid URL" }).or(z.literal("")),
  logoUrl: z.string().optional(),
  isManual: z.boolean().default(false),
  jobTitle: z
    .string({ error: "Job title must be at least 2 characters" })
    .min(2),
  jobUrl: z
    .url({ error: "Please enter a valid job posting link" })
    .or(z.literal("")),
  location: z.string({ error: "Location is required" }).min(1),
  salary: z.string().optional(),
  dateApplied: z.date({ error: "Please select a date" }),

  //Documents like CV, Cover Letter, etc
  cv: z.custom<FileList>().optional(),
  extraDocs: z
    .custom<FileList>()
    .optional()
    .refine((f) => !f || f.length <= 5, { error: "Max 5 documents" }),

  //Status
  status: z
    .enum(["Saved", "Applied", "Interviewing", "Offer", "Rejected"])
    .default("Applied"),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
