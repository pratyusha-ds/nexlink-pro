"use client";

import UserPage from "@/components/page/UserPage";
import { Application, getColumns } from "@/components/tables/applications/columns";
import { DataTable } from "@/components/tables/DataTable";
import { ApplicationDetailModal } from "@/components/tables/ApplicationDetailModal";
import { DeleteConfirmDialog } from "@/components/tables/DeleteConfirmDialog";
import { FilterOption } from "@/components/tables/TableFilters";
import { getApplications, getApplicationById, deleteApplications, updateApplicationStatus } from "@/lib/data";
import { useEffect, useState } from "react";

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    getApplications().then((data) => {
      setApplications(data);
      setIsLoading(false);
    });
  }, []);

  const handleView = async (row: Application) => {
    const fullApp = await getApplicationById(row.id);
    if (fullApp) {
      setSelectedApp(fullApp as Application);
      setShowDetailModal(true);
    }
  };

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
        onEdit={(id) => {
          console.log("Edit:", id);
        }}
        onStatusChange={async (id, status) => {
          await updateApplicationStatus(id, status);
          const data = await getApplications();
          setApplications(data);
        }}
      />

      <ApplicationDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        application={selectedApp}
        onEdit={(id) => {
          console.log("Edit:", id);
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
            setShowDetailModal(false);
            const data = await getApplications();
            setApplications(data);
          }
        }}
      />
    </UserPage>
  );
};

export default ApplicationsPage;
