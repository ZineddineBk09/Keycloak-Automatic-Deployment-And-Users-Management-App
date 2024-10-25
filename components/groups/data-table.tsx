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
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DataTablePagination } from "../ui/pagination";
import { useGroupsContext } from "../../context/groups";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../ui/skeleton";
import { KeycloakGroup } from "../../interfaces";
import { deleteRecord, getCount, updateRecord } from "../../lib/api/keycloak";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import AddDialog from "./dialogs/add";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const { groups, fetchGroups, deleteGroups } = useGroupsContext();
  const [data, setData] = React.useState<TData[]>([] as TData[]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [count, setCount] = React.useState(0);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
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
    },
    meta: {
      deleteRow: async (row: KeycloakGroup) => {
        await deleteRecord("groups", row.id)
          .then(() => {
            toast.success("Group deleted successfully");
            fetchGroups();
          })
          .catch((error) => {
            toast.error("Error deleting client");
          });
      },

      updateRow: async (row: KeycloakGroup) => {
        await updateRecord("groups", row, row.id)
          .then(() => {
            toast.success("Group updated successfully");
            fetchGroups();
          })
          .catch((error) => {
            toast.error("Error updating client");
          });
      },
    },
  });
  const [isDeleteDisabled, setIsDeleteDisabled] = React.useState<boolean>(true);

  const handleDeleteUsers = async () => {
    const rowsIndices = Object.keys(rowSelection);
    const groupsIds: string[] = rowsIndices.map(
      (idx: string) => (data[Number(idx)] as any).id as string
    );
    deleteGroups(groupsIds)
      .then(() => {
        const msg: string = groupsIds.length > 1 ? "Users" : "User";
        toast.success(msg + " deleted successfully");
        setRowSelection({});
      })
      .catch((error) => {
        toast.error("Error deleting groups");
      });
  };

  React.useEffect(() => {
    setData(groups as TData[]);
  }, [groups]);

  // check if there is any rows selected to enable the delete button

  React.useEffect(() => {
    if (Object.keys(rowSelection).length) {
      setIsDeleteDisabled(false);
    } else {
      setIsDeleteDisabled(true);
    }
  }, [rowSelection]);

  React.useEffect(() => {
    getCount("groups").then((data) => {
      setCount(Number(data?.count) || groups?.length);
    });
  }, [groups]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="flex items-center gap-x-3 text-3xl font-bold mb-10">
        Groups
        <Badge className="font-normal px-3" color="amber">
          {new Intl.NumberFormat().format(count)}
        </Badge>
      </h1>
      <div>
        {/* Filters */}
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter client id..."
            value={
              (table.getColumn("clientId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("clientId")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-x-4 ml-auto">
          <AddDialog />
            {!isDeleteDisabled && (
              <Button variant="outline" onClick={handleDeleteUsers}>
                Delete ({Object.keys(rowSelection).length})
                <TrashIcon
                  className="h-6 w-6 text-red-500 ml-2"
                  aria-hidden="true"
                />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column, index) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={index}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={async () => {
                await fetchGroups()
                  .then(() => {
                    toast.success("Groups fetched successfully");
                    fetchGroups();
                  })
                  .catch((error) => {
                    toast.error("Error fetching groups");
                  });
              }}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Reload</span>
              <ReloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table Rows */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <TableRow key={index}>
                  {headerGroup.headers.map((header, idx) => {
                    return (
                      <TableHead key={idx}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table?.getRowModel().rows?.length ? (
                table?.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {Array.from({ length: 10 }, (_, index) => (
                      <Skeleton
                        className="h-12 w-full rounded-xl border my-1"
                        key={index}
                      />
                    )).map((skeleton) => skeleton)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
