'use client'
import { columns } from '@/components/dashboard/columns'
import { DataTable } from '@/components/dashboard/data-table'
import AuthProvider from '@/context/auth-context'
import { UsersContextProvider, useUsersContext } from '@/context/users'

export default function MainPage() {
  

  return (
    <AuthProvider>
      <UsersContextProvider>
        <div className='container mx-auto py-10'>
          <h1 className='text-3xl font-bold mb-10'>Keycloak Users</h1>
          <DataTable columns={columns}/>
        </div>
      </UsersContextProvider>
    </AuthProvider>
  )
}
