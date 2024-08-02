'use client'
import { useState } from 'react'
import { columns } from '../../components/users/columns'
import { DataTable } from '../../components/users/data-table'
import { UsersContextProvider } from '../../context/users'
import { getUsersCount } from '../../lib/api/keycloak'
import { Badge } from "../../components/ui/badge"

export default function UsersPage() {
  const [count, setCount] = useState(0)

  getUsersCount().then((data) => {
    setCount(data)
  })

  return (
    <>
      <UsersContextProvider>
        <div className='container mx-auto py-10'>
          <h1 className='flex items-center gap-x-3 text-3xl font-bold mb-10'>Users
            <Badge className='font-normal px-3' color='amber'>{
              new Intl.NumberFormat().format(count)
            }</Badge>
          </h1>
          <DataTable columns={columns} />
        </div>
      </UsersContextProvider>
    </>
  )
}
