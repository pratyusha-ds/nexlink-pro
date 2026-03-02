"use server";

import { MOCK_JOBS } from "./mock-jobs";
import { db } from "./prisma";

const API_KEY = process.env.THEIRSTACK_API_KEY;
const API_URL = "https://api.theirstack.com/v1/jobs/search";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  url: string;
  logo: string | null;
};

function getStartOfTodayUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
    ),
  );
}

function mapApiJob(job: any): Job {
  return {
    id: String(job.id),
    title: job.job_title,
    company: job.company || job.company_object?.name || "Unknown",
    location: job.short_location || "Remote",
    date: new Date(job.date_posted).toLocaleDateString(),
    url: job.final_url || job.url || "#",
    logo: job.company_object?.logo || null,
  };
}

export async function initializeJobList(): Promise<Job[]> {
  try {
    const startOfTodayUTC = getStartOfTodayUTC();

    const cached = await db.cachedJob.findFirst({
      where: {
        cachedAt: {
          gte: startOfTodayUTC,
        },
      },
    });

    if (cached) {
      const allCached = await db.cachedJob.findMany({
        orderBy: { cachedAt: "desc" },
      });
      return allCached;
    }

    if (!API_KEY) return MOCK_JOBS;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        job_title_or: ["Software Engineer"],
        posted_at_max_age_days: 7,
        limit: 12,
      }),
    });

    if (response.status === 402) {
      console.info("Credits exhausted.");
      return MOCK_JOBS;
    }

    if (!response.ok) return MOCK_JOBS;

    const result = await response.json();
    if (!result.data || result.data.length === 0) return MOCK_JOBS;

    const jobs: Job[] = result.data.map(mapApiJob);
    await db.cachedJob.deleteMany({});
    await db.cachedJob.createMany({
      data: jobs.map((job) => ({ ...job, cachedAt: new Date() })),
    });

    return jobs;
  } catch (error) {
    console.error("Error:", error);
    return MOCK_JOBS;
  }
}

export async function searchJobs(query: string = ""): Promise<Job[]> {
  try {
    if (!API_KEY) return MOCK_JOBS;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        job_title_or: [query || "Software Engineer"],
        posted_at_max_age_days: 7,
        limit: 12,
      }),
    });

    if (response.status === 402) {
      console.info("Credits exhausted. Showing static preview jobs.");
      return MOCK_JOBS;
    }

    if (!response.ok) return MOCK_JOBS;

    const result = await response.json();
    if (!result.data || result.data.length === 0) return MOCK_JOBS;

    const jobs: Job[] = result.data.map(mapApiJob);

    for (const job of jobs) {
      await db.cachedJob.upsert({
        where: { id: job.id },
        update: { ...job, cachedAt: new Date() },
        create: { ...job, cachedAt: new Date() },
      });
    }

    return jobs;
  } catch (error) {
    console.info("Connection error.");
    return MOCK_JOBS;
  }
}
