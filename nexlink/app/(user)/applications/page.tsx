"use client";

import UserPage from "@/components/page/UserPage";
import {
  Application,
  getColumns,
} from "@/components/tables/applications/columns";
import { DataTable } from "@/components/tables/DataTable";
import { ApplicationDetailModal } from "@/components/tables/ApplicationDetailModal";
import { DeleteConfirmDialog } from "@/components/tables/DeleteConfirmDialog";
import { ApplicationEditModal } from "@/components/sections/private/application/ApplicationEditModal";
import { FilterOption } from "@/components/tables/TableFilters";
import {
  getApplications,
  getApplicationById,
  deleteApplications,
  updateApplicationStatus,
} from "@/lib/data";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const statusOptions: FilterOption[] = [
  {
    label: "Status",
    value: "status",
    options: [
      { label: "Pending", value: "PENDING" },
      { label: "Applied", value: "APPLIED" },
      { label: "Being Processed", value: "BEING_PROCESSED" },
      { label: "Waiting for Interview", value: "WAITING_FOR_INTERVIEW" },
      { label: "Rejected", value: "REJECTED" },
    ],
  },
];

const typeOptions: FilterOption[] = [
  {
    label: "Type",
    value: "type",
    options: [
      { label: "Regular", value: "REGULAR" },
      { label: "Internship", value: "INTERNSHIP" },
    ],
  },
];

const modeOptions: FilterOption[] = [
  {
    label: "Mode",
    value: "mode",
    options: [
      { label: "Remote", value: "REMOTE" },
      { label: "On Site", value: "ON_SITE" },
      { label: "Hybrid", value: "HYBRID" },
    ],
  },
];

const ApplicationsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const selectedId = searchParams.get("id");
  const isEditMode = searchParams.get("edit") === "true";

  const handleView = async (row: Application) => {
    router.push(`${pathname}?id=${row.id}`);
  };
  useEffect(() => {
    getApplications().then((data) => {
      setApplications(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedId) {
      getApplicationById(Number(selectedId)).then((data) => {
        setSelectedApp(data as Application);
      });
    }
  }, [selectedId]);

  return (
    <UserPage
      title="Applications"
      description="Fill in the details manually or search for a company to auto-fill"
    >
      <DataTable
        columns={getColumns(async (id, status) => {
          await updateApplicationStatus(id, status);
          const data = await getApplications();
          setApplications(data);
        })}
        data={applications}
        isLoading={isLoading}
        searchKeys={["companyName", "jobTitle"]}
        searchPlaceholder="Search here..."
        filters={[...statusOptions, ...typeOptions, ...modeOptions]}
        onDelete={async (rows) => {
          const ids = rows.map((row) => (row as Application).id);
          await deleteApplications(ids);
          const data = await getApplications();
          setApplications(data);
        }}
        onView={handleView}
        onStatusChange={async (id, status) => {
          await updateApplicationStatus(id, status);
          const data = await getApplications();
          setApplications(data);
        }}
      />

      <ApplicationDetailModal
        open={!!selectedId && !isEditMode}
        onOpenChange={() => router.push(pathname)}
        application={selectedApp}
        onEdit={async (id) => {
          router.push(`${pathname}?=id=${id}&edit=true`);
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setShowDeleteConfirm(true);
        }}
        onStatusChange={async (id, status) => {
          await updateApplicationStatus(id, status);
          const data = await getApplications();
          setApplications(data);
          if (selectedApp) {
            const updated = await getApplicationById(id);
            setSelectedApp(updated as Application);
          }
        }}
      />

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={async () => {
          if (deleteId) {
            await deleteApplications([deleteId]);
            router.push(pathname);
            const data = await getApplications();
            setApplications(data);
          }
        }}
      />

      <ApplicationEditModal
        open={isEditMode}
        onOpenChange={() => router.push(pathname)}
        application={selectedApp}
        onSuccess={async () => {
          const data = await getApplications();
          setApplications(data);
        }}
      />
    </UserPage>
  );
};

export default ApplicationsPage;
