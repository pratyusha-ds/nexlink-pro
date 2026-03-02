// NOTE: we can add the user id on the params of each call to remove the calling of getCurrentUserId on each get db call.
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

async function getCurrentUserId() {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });

  return dbUser?.id ?? null;
}

export async function getUserRemindersSetting() {
  const user = await currentUser();
  if (!user) return false;

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: { reminders: true },
  });

  return dbUser?.reminders ?? false;
}

export async function updateUserRemindersSetting(enabled: boolean) {
  const user = await currentUser();
  if (!user) return null;

  return await db.user.update({
    where: { clerkId: user.id },
    data: { reminders: enabled },
  });
}

export async function getRecentApplications() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return await db.application.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplications() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return await db.application.findMany({
    where: { userId },
    select: {
      id: true,
      jobTitle: true,
      companyName: true,
      status: true,
      type: true,
      mode: true,
      notes: true,
      interviewDnT: true,
      website: true,
      jobUrl: true,
      description: true,
      email: true,
      location: true,
      salary: true,
      logoUrl: true,
      enableReminder: true,
      reminderInterval: true,
      expirationDate: true,
    },
    orderBy: { id: "asc" },
  });
}

export async function getApplicationById(id: number) {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return await db.application.findFirst({
    where: { id, userId },
  });
}

export async function getStatusStats() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const stats = await db.application.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });

  return stats.map((item) => ({
    name: item.status.replace(/_/g, " "),
    total: item._count.status,
  }));
}

export async function getTypeStats() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const stats = await db.application.groupBy({
    by: ["type"],
    where: { userId },
    _count: { type: true },
  });

  return stats.map((item) => ({
    name: item.type,
    value: item._count.type,
  }));
}

export async function getModeStats() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const stats = await db.application.groupBy({
    by: ["mode"],
    where: { userId },
    _count: { type: true },
  });

  return stats.map((item) => ({
    name: item.mode,
    value: item._count.type,
  }));
}

export async function deleteApplications(ids: number[]) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.application.deleteMany({
    where: {
      id: { in: ids },
      userId,
    },
  });
}

export async function updateApplicationStatus(id: number, status: string) {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return await db.application.update({
    where: {
      id,
      userId,
    },
    data: {
      status: status as any,
    },
  });
}

export async function getReminders() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const reminders = await db.reminder.findMany({
    where: {
      application: {
        userId,
        enableReminder: true,
      },
    },
    select: {
      id: true,
      lastSentAt: true,
      nextSendAt: true,
      application: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
          status: true,
          reminderInterval: true,
          expirationDate: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return reminders.map((reminder) => ({
    id: reminder.id,
    applicationId: reminder.application.id,
    companyName: reminder.application.companyName,
    jobTitle: reminder.application.jobTitle,
    applicationStatus: reminder.application.status,
    interval: reminder.application.reminderInterval,
    expirationDate: reminder.application.expirationDate,
    lastSentAt: reminder.lastSentAt,
    nextSendAt: reminder.nextSendAt,
  }));
}

export async function updateReminderEnable(
  applicationId: number,
  enable: boolean,
) {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const application = await db.application.findFirst({
    where: { id: applicationId, userId },
  });

  if (!application) return null;

  return await db.application.update({
    where: { id: applicationId },
    data: { enableReminder: enable },
  });
}

export async function deleteReminders(applicationIds: number[]) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.application.updateMany({
    where: {
      id: { in: applicationIds },
      userId,
    },
    data: {
      enableReminder: false,
    },
  });
}
