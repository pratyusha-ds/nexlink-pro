"use client";

import UserPage from "@/components/page/UserPage";
import { Application, columns } from "@/components/tables/applications/columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const CreateApplicationPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function TableSkeleton() {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    );
  }

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/getApplications");
      if (!res.ok)
        throw new Error("Failed to fetch applications. Server side issue.");

      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Fetch failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <UserPage
      title="Applications"
      description="Fill in the details manually or search for a company to auto-fill"
    >
      <div className="space-y-4">
        <div className="flex justify-between">
          <Button onClick={() => redirect("/applications/create")}>
            Create
          </Button>
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable columns={columns} data={applications} />
        )}
      </div>
    </UserPage>
  );
};

export default CreateApplicationPage;
