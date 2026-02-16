"use client";

import UserPage from "@/components/page/UserPage";
import { Application, columns } from "@/components/tables/applications/columns";
import { DataTable } from "@/components/tables/DataTable";
import { getApplications } from "@/lib/data";
import { useEffect, useState } from "react";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getApplications().then((data) => {
      setApplications(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <UserPage
      title="Applications"
      description="Fill in the details manually or search for a company to auto-fill"
    >
      <DataTable columns={columns} data={applications} isLoading={isLoading} />
    </UserPage>
  );
};

export default ApplicationsPage;
