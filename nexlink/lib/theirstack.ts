import { MOCK_JOBS } from "./mock-jobs";

const API_KEY = process.env.THEIRSTACK_API_KEY;
const API_URL = "https://api.theirstack.com/v1/jobs/search";

export async function searchJobs(query: string = "") {
  try {
    if (!API_KEY) return [];

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

    if (!response.ok) return [];

    const result = await response.json();
    if (!result.data || result.data.length === 0) return [];

    return result.data.map((job: any) => ({
      id: job.id,
      title: job.job_title,
      company: job.company || job.company_object?.name || "Unknown",
      location: job.short_location || "Remote",
      date: new Date(job.date_posted).toLocaleDateString(),
      url: job.final_url || job.url || "#",
      logo: job.company_object?.logo || null,
    }));
  } catch (error) {
    console.info("Connection error.");
    return [];
  }
}
