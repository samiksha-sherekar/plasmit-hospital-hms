"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsLeft, ChevronsRight, ChevronsUpDown, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DataTable<TData>({
  columns,
  data,
  loading,
  className,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  className?: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // TanStack Table intentionally returns table helpers that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white p-3 shadow-soft">
        <Skeleton className="h-8 w-full" />
        <div className="mt-3 space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton className="h-[var(--density-control-height-lg)] w-full" key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState icon={SearchX} title="No records found" description="Adjust filters or search another term to continue." />;
  }

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount() || 1;
  const pageNumbers = paginationPages(pageIndex + 1, pageCount);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-white shadow-soft", className)}>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[#f7f7fb] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="border-b border-border/80 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]" key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        className="inline-flex items-center gap-1.5 text-left uppercase tracking-wide outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-default"
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                          )
                        ) : null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="border-b border-border/70 last:border-0 hover:bg-surface-muted/80" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] align-middle text-foreground" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-2 border-t border-border/80 bg-white px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            {data.length} records - Page {pageIndex + 1} of {pageCount}
          </span>
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground outline-none"
              value={pagination.pageSize}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                setPagination((current) => ({ ...current, pageSize: nextSize, pageIndex: 0 }));
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="First page">
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          {pageNumbers.map((page) => (
            <Button
              className="min-w-8 px-2"
              key={page}
              size="sm"
              variant={page === pageIndex + 1 ? "default" : "outline"}
              onClick={() => table.setPageIndex(page - 1)}
              aria-current={page === pageIndex + 1 ? "page" : undefined}
            >
              {page}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <Button size="sm" variant="outline" onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()} aria-label="Last page">
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function paginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

  if (currentPage <= 3) return [1, 2, 3, 4, 5];
  if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}
