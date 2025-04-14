"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";
import { DataTablePagination } from "./pagination";
import { useUsersContext } from "../../context/users";
import { ReloadIcon, TrashIcon, DownloadIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../ui/skeleton";
import { KeycloakUser, Realm } from "../../interfaces";
import {
  deleteRecord,
  getCount,
  updateRecord,
  getRealms,
} from "../../lib/api/keycloak";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { downloadCSV } from "../../lib/utils/export";
import { useRealmsContext } from "../../context/realms";
import { AddRealmDialog } from "./dialogs/add";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const { realms, page, pageSize, fetchRealms, setPage, setPageSize } =
    useRealmsContext();
  const [data, setData] = React.useState<TData[]>([] as TData[]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [count, setCount] = React.useState(0);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDeleteDisabled, setIsDeleteDisabled] = React.useState<boolean>(true);
  const table = useReactTable({
    data: React.useMemo(() => data, [data]),
    columns: React.useMemo(() => columns, [columns]),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize:10,
        pageIndex: 0, // Adjusting for zero-based index
      },
    },
    meta: {
      deleteRow: async (row: KeycloakUser) => {
        await deleteRecord("users", row.id)
          .then(() => {
            toast.success("User deleted successfully");
            // fetchUsers(1);
          })
          .catch((error) => {
            toast.error("Error deleting user");
          });
      },

      updateRow: async (row: KeycloakUser) => {
        await updateRecord("users", row, row.id)
          .then(() => {
            toast.success("User updated successfully!");
            // fetchUsers(1);
          })
          .catch((error) => {
            toast.error("Error updating user");
          });
      },
    },
  });

  React.useEffect(() => {
    setData(realms as TData[]);
  }, [realms]);

  console.log(data);

  React.useEffect(() => {
    fetchRealms();
  }, []);

  // check if there is any rows selected to enable the delete button
  React.useEffect(() => {
    if (Object.keys(rowSelection).length) {
      setIsDeleteDisabled(false);
    } else {
      setIsDeleteDisabled(true);
    }
  }, [rowSelection]);

  const handleExport = () => {
    const exportData = realms.map((realm: Realm) => ({
      ...realm,
    }));

    downloadCSV(
      exportData,
      `keycloak-realms-${new Date().toISOString().split("T")[0]}`
    );
    toast.success("Realms exported successfully");
  };

  return (
    <div className="container !max-w-[90vw] mx-auto py-10">
      <h1 className="flex items-center gap-x-3 text-3xl font-bold mb-10">
        Realms
        <Badge className="font-normal px-3" color="amber">
          {new Intl.NumberFormat().format(realms.length)}
        </Badge>
      </h1>
      <div className="flex items-center py-4">
        <div className="flex items-center gap-x-4 ml-auto">
          <AddRealmDialog />
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={realms.length === 0}
          >
            Export
            <DownloadIcon className="h-4 w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await fetchRealms(1)
                .then(() => {
                  toast.success("Realms fetched successfully");
                })
                .catch((error: any) => {
                  toast.error("Error fetching realms");
                });
            }}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Reload</span>
            <ReloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
