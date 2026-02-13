"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Info } from "lucide-react";

export type Application = {
    id: number;
    companyName: string;
    status: status;
    type: type;
    notes: string | null;
    interviewDnT: Date | null; 
}

export type status = "PENDING" | "APPLIED" | "BEING_PROCESSED" | "WAITING_FOR_INTERVIEW" | "REJECTED";
export type type = "REMOTE" | "ON_SITE" | "HYBRID";

function formatStatus(status: status) {
    const statusConfig = {
        PENDING: { label: "Pending", className: "bg-yellow-500 hover:bg-yellow-600" },
        APPLIED: { label: "Applied", className: "bg-malachite hover:bg-primary" },
        BEING_PROCESSED: { label: "Being Processed", className: "bg-orange-500 hover:bg-orange-600" },
        WAITING_FOR_INTERVIEW: { label: "Waiting for Interview", className: "bg-purple-500 hover:bg-purple-600" },
        REJECTED: { label: "Rejected", className: "bg-red-500 hover:bg-red-600" }
    };

    const config = statusConfig[status];
    
    return (
        <Badge className={`${config.className} text-white`}>
            {config.label}
        </Badge>
    );
}

function formatType(type: type) {
    const typeLabels = {
        REMOTE: "Remote",
        ON_SITE: "On-site",
        HYBRID: "Hybrid"
    };
    
    return <span className="font-semibold">{typeLabels[type]}</span>;
}

function formatDate(date: Date | null) {
    if (!date) return <span className="text-muted-foreground">-</span>;
    
    const dateObj = new Date(date);
    return (
        <span>
            {dateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            })}
        </span>
    );
}

export const columns: ColumnDef<Application>[] = [
    {
        accessorKey: "id",
        header: "ID",
        size: 60,
        meta: {
            className: "w-[60px]"
        }
    },
    {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => {
            const notes = row.original.notes;
            const companyName = row.getValue("companyName") as string;
            
            if (notes) {
                return (
                    <div className="flex items-center gap-2">
                        <span>{companyName}</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <Info className="h-4 w-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Notes</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {notes}
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                );
            }
            
            return <span>{companyName}</span>;
        },
        meta: {
            className: "w-[200px]"
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => formatStatus(row.getValue("status")),
        size: 180,
        meta: {
            className: "w-[180px]"
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => formatType(row.getValue("type")),
        size: 100,
        meta: {
            className: "w-[100px]"
        }
    },
    {
        accessorKey: "interviewDnT",
        header: "Interview Date",
        cell: ({ row }) => formatDate(row.getValue("interviewDnT")),
        size: 130,
        meta: {
            className: "w-[130px]"
        }
    },
]
