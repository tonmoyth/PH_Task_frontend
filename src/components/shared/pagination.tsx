"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/config/constants";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function Pagination({
  page,
  limit,
  total,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = (newPage: number, newLimit?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    if (newLimit !== undefined) {
      params.set("limit", String(newLimit));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{start}</span>–
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{end}</span> of{" "}
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{total}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 whitespace-nowrap">Rows per page</span>
          <Select
            value={String(limit)}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value, 10);
              updateQuery(1, newLimit);
            }}
            className="h-8 w-20 text-xs py-1"
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuery(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-xs font-medium px-2 text-zinc-700 dark:text-zinc-300">
            Page {page} of {Math.max(totalPages, 1)}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuery(page + 1)}
            disabled={page >= totalPages || totalPages === 0}
            aria-label="Next page"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
