"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyTable from "./EmptyTable";
import { TableFilters, FilterOption } from "./TableFilters";
import NoSearchResult from "./NoSearchResult";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { FiTrash2 } from "react-icons/fi";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterKey?: string;
    className?: string;
  }

  interface TableMeta<TData> {
    onStatusChange?: (id: number, status: string) => void;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchKey?: string;
  searchKeys?: string[];
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onDelete?: (rows: TData[]) => void;
  onView?: (row: TData) => void;
  onStatusChange?: (id: number, status: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search...",
  filters,
  onDelete,
  onView,
  onStatusChange,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<TData | null>(
    null,
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    meta: {
      onStatusChange,
    },
  });

  const selectedRows = Object.keys(rowSelection);
  const isSelectionMode = selectedRows.length > 0;

  const isEmpty = table.getRowModel().rows?.length === 0;
  const hasActiveFilters = !!globalFilter || columnFilters.length > 0;
  const showNoResult = hasActiveFilters && isEmpty && !isLoading;

  const showFilters = !isEmpty || hasActiveFilters;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const trimmedValue = value.trim();
    setGlobalFilter(trimmedValue);
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    if (value === "all") {
      table.getColumn(columnKey)?.setFilterValue(undefined);
    } else {
      table.getColumn(columnKey)?.setFilterValue(value);
    }
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setGlobalFilter("");
    setColumnFilters([]);
    columns.forEach((col) => {
      const filterKey = col.meta?.filterKey;
      if (filterKey) {
        table.getColumn(filterKey)?.setFilterValue(undefined);
      }
    });
  };

  const handleClearSelection = () => {
    setRowSelection({});
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onDelete?.(selectedData);
    setRowSelection({});
  };

  const handleRowClick = (rowData: TData) => {
    if (onView) {
      setSelectedApplication(rowData);
      onView(rowData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between h-12">
        {isSelectionMode ? (
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
              >
                <FiTrash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ) : showFilters ? (
          <TableFilters
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            filters={
              filters?.map((f) => ({
                columnKey: f.value,
                placeholder: f.label,
                options: f.options || [],
                value:
                  (table.getColumn(f.value)?.getFilterValue() as string) ||
                  "all",
                onChange: (value) => handleFilterChange(f.value, value),
              })) || undefined
            }
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : null}

        {!isSelectionMode && (
          <Button
            onClick={() => router.push("/applications/create")}
            className="ml-auto"
          >
            Create
          </Button>
        )}
      </div>

      <div className="rounded-md border-gray-200 border bg-white">
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-12">
                  <Skeleton className="h-5 w-5" />
                </TableHead>
                {columns.map((_, i) => (
                  <TableHead key={i} className={columns[i]?.meta?.className}>
                    <Skeleton className="h-5 w-32 mr-auto" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="h-16 border-none">
                  <TableCell className="w-12">
                    <Skeleton className="h-5 w-5" />
                  </TableCell>
                  {columns.map((_, j) => (
                    <TableCell key={j} className={columns[j]?.meta?.className}>
                      <Skeleton className="h-5 w-32 mr-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : showNoResult ? (
          <NoSearchResult />
        ) : !isEmpty ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-200 hover:bg-transparent"
                >
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                      }
                      onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                      }
                      aria-label="Select all"
                    />
                  </TableHead>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={header.column.columnDef.meta?.className}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-16 border-y border-gray-200 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(row.original)}
                >
                  <TableCell
                    className="w-12"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                      onClick={(e) => {
                        if (cell.column.id === "status") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {Array.from({
                length: 10 - table.getRowModel().rows.length,
              }).map((_, index) => (
                <TableRow
                  key={`empty-${index}`}
                  className="h-16 border-y border-gray-200 hover:bg-transparent"
                >
                  <TableCell className="w-12"></TableCell>
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={columns[colIndex]?.meta?.className}
                    >
                      &nbsp;
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyTable />
        )}
      </div>

      {/* Pagination */}
      {!isLoading &&
        !isEmpty &&
        !showNoResult &&
        table.getRowModel().rows?.length > 10 && (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        count={selectedRows.length}
      />
    </div>
  );
}
