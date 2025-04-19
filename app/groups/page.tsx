"use client";
import { columns } from "../../components/groups/columns";
import { DataTable } from "../../components/groups/data-table";
import { GroupsContextProvider } from "../../context/groups";

export default function GroupsPage() {
  return (
    <>
      <GroupsContextProvider>
        <DataTable columns={columns} />
      </GroupsContextProvider>
    </>
  );
}
