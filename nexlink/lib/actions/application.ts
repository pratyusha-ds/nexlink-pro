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
