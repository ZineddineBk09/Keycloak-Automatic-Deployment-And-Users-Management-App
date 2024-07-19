'use client'
import { columns } from '../../components/users/columns'
import { DataTable } from '../../components/users/data-table'
import { UsersContextProvider } from '../../context/users'

export default function UsersPage() {
  return (
    <>
      <UsersContextProvider>
        <div className='container mx-auto py-10'>
          <h1 className='text-3xl font-bold mb-10'>Users</h1>
          <DataTable columns={columns} />
        </div>
      </UsersContextProvider>
    </>
  )
}
