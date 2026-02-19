import { initializeJobList, searchJobs } from "@/lib/theirstack";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/sections/private/search/JobCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  const results = query ? await searchJobs(query) : await initializeJobList();

  const isMockMode = JSON.stringify(results) === JSON.stringify(MOCK_JOBS);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {isMockMode
              ? "Featured Opportunities"
              : query
                ? `Results for "${query}"`
                : "Recent Opportunities"}
          </h1>
          <p className="text-muted-foreground">
            {isMockMode
              ? "API limit reached. Showing example listings."
              : "Top remote listings from the last 7 days."}
          </p>
        </div>

        <form className="flex gap-2">
          <Input
            name="q"
            placeholder="Search roles..."
            defaultValue={query}
            className="w-full md:w-64"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.length > 0 ? (
          results.map((job: any) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No jobs found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
