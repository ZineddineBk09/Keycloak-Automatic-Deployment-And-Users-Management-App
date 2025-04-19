"use client";

import { columns } from "../../components/realms/columns";
import { DataTable } from "../../components/realms/data-table";
import { RealmsContextProvider } from "../../context/realms";

export default function RealmsPage() {
  return (
    <RealmsContextProvider>
      <DataTable columns={columns} />
    </RealmsContextProvider>
  );
}