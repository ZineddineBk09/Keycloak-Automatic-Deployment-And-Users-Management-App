'use client'
import { columns } from '../../components/clients/columns'
import { DataTable } from '../../components/clients/data-table'
import { ClientsContextProvider } from '../../context/clients'

export default function ClientsPage() {
  return (
    <>
      <ClientsContextProvider>
        <div className='container mx-auto py-10'>
          <h1 className='text-3xl font-bold mb-10'>Keycloak Clients</h1>
          <DataTable columns={columns} />
        </div>
      </ClientsContextProvider>
    </>
  )
}
