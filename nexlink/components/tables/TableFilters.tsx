"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FiFilter, FiX } from "react-icons/fi";

export interface FilterOption {
  label: string;
  value: string;
  options?: FilterOption[];
}

export interface TableFilterConfig {
  label: string;
  value: string;
  options: FilterOption[];
}

export interface TableFiltersProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: {
    columnKey: string;
    placeholder: string;
    options: FilterOption[];
    value?: string;
    onChange: (value: string) => void;
  }[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function TableFilters({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = [],
  onClearFilters,
  hasActiveFilters = false,
}: TableFiltersProps) {
  const activeFilters = filters.filter((f) => f.value && f.value !== "all");

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className="max-w-sm shadow-none focus-visible:ring-0"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`shadow-none border-gray-200 text-gray-400 focus-visible:ring-0 gap-2 ${activeFilters.length > 0 ? "border-primary text-primary" : ""
              }`}
          >
            <FiFilter className="h-4 w-4" />
            {activeFilters.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full min-w-5 h-5 text-xs flex items-center justify-center px-1">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0 border border-gray-200"
          align="start"
          sideOffset={4}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FiFilter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Filters</span>
                {activeFilters.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({activeFilters.length} active)
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>

            {activeFilters.length > 0 && (
              <div className="px-4 py-2 bg-muted/50 border-b">
                <p className="text-xs text-muted-foreground mb-2">
                  Active filters
                </p>
                <div className="flex flex-wrap gap-1">
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.columnKey}
                      onClick={() => filter.onChange("all")}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                    >
                      <span>{filter.placeholder}:</span>
                      <span className="font-medium">
                        {
                          filter.options.find((o) => o.value === filter.value)
                            ?.label
                        }
                      </span>
                      <FiX className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 space-y-4 max-h-75 overflow-y-auto">
              {filters.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No filters available
                </p>
              ) : (
                <>
                  {filters.map((filter) => (
                    <div key={filter.columnKey} className="space-y-2">
                      <label className="text-xs font-medium text-foreground">
                        {filter.placeholder}
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {filter.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => filter.onChange(option.value)}
                            className={`px-3 py-1.5 text-xs rounded-full border border-gray-200 transition-all ${filter.value === option.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background hover:bg-muted hover:border-muted-foreground"
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
