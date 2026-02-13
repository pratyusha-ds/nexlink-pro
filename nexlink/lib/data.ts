import { db } from "./prisma";

export async function getRecentApplications() {
  return await db.application.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });
}

export async function getStatusStats() {
  const stats = await db.application.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return stats.map((item) => ({
    name: item.status.replace(/_/g, " "),
    total: item._count.status,
  }));
}

export async function getTypeStats() {
  const stats = await db.application.groupBy({
    by: ["type"],
    _count: { type: true },
  });

  return stats.map((item) => ({
    name: item.type,
    value: item._count.type,
  }));
}
