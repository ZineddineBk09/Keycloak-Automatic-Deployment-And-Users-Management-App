"use client";
import { columns } from "../../components/clients/columns";
import { DataTable } from "../../components/clients/data-table";
import { ClientsContextProvider } from "../../context/clients";

export default function ClientsPage() {
  return (
    <>
      <ClientsContextProvider>
        <DataTable columns={columns} />
      </ClientsContextProvider>
    </>
  );
}
