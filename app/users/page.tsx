"use client";

import { columns } from "../../components/users/columns";
import { DataTable } from "../../components/users/data-table";
import { UsersContextProvider } from "../../context/users";

export default function UsersPage() {
  return (
    <>
      <UsersContextProvider>
        <DataTable columns={columns} />
      </UsersContextProvider>
    </>
  );
}
