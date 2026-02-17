"use server";

import { db } from "../prisma";
import { currentUser } from "@clerk/nextjs/server";
import {
  applicationSchema,
  type ApplicationFormValues,
} from "../validations/application";

export const createApplication = async (data: ApplicationFormValues) => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized: No user logged in.");
  }

  const user = await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    },
  });

  const validatedForm = applicationSchema.parse(data);

  const application = await db.application.create({
    data: {
      userId: user.id,
      companyName: validatedForm.companyName,
      jobTitle: validatedForm.jobTitle,
      status: validatedForm.status,
      mode: validatedForm.mode,
      type: validatedForm.type,
      website: validatedForm.website || null,
      jobUrl: validatedForm.jobUrl || null,
      logoUrl: validatedForm.logoUrl || null,
      description: validatedForm.description,
      email: validatedForm.email,
      location: validatedForm.location,
      notes: validatedForm.notes || null,
      salary: validatedForm.salary || null,
      interviewDnT: validatedForm.interviewDnT || null,
    },
  });

  return application;
};

export const updateApplication = async (
  id: number,
  data: Partial<ApplicationFormValues>
) => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized: No user logged in.");
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const application = await db.application.findUnique({
    where: { id, userId: user.id },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  const validatedForm = applicationSchema.partial().parse(data);

  const updated = await db.application.update({
    where: { id },
    data: {
      companyName: validatedForm.companyName ?? application.companyName,
      jobTitle: validatedForm.jobTitle ?? application.jobTitle,
      status: validatedForm.status ?? application.status,
      mode: validatedForm.mode ?? application.mode,
      type: validatedForm.type ?? application.type,
      website: validatedForm.website ?? application.website,
      jobUrl: validatedForm.jobUrl ?? application.jobUrl,
      logoUrl: validatedForm.logoUrl ?? application.logoUrl,
      description: validatedForm.description ?? application.description,
      email: validatedForm.email ?? application.email,
      location: validatedForm.location ?? application.location,
      notes: validatedForm.notes ?? application.notes,
      salary: validatedForm.salary ?? application.salary,
      interviewDnT: validatedForm.interviewDnT ?? application.interviewDnT,
    },
  });

  return updated;
};
