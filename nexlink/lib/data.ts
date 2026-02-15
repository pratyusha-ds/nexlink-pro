// NOTE: we can add the user id on the params of each call to remove the calling of getCurrentUserId on each get db call.

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

export async function getRecentApplications() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return await db.application.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: "desc" },
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
