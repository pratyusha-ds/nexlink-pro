
"use client"

import { ColumnDef } from "@tanstack/react-table";

export type Application = {
    id: number;
    companyName: string;
    status: "PENDING" | "APPLIED" | "BEING PROCESSED" | "WAITING FOR INTERVIEW" | "REJECTED";
    description: string;
    email: string;
    location: string;
    type: "REMOTE" | "ON-SITE" | "HYBRID";
    notes: string;
    interviewDnT: Date; 
}

export const columns: ColumnDef<Application>[] = [
    
    {
        accessorKey: "companyName",
        header: "Company"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "type",
        header: "Type"
    }
]
