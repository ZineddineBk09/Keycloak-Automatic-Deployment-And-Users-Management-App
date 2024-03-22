import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Keycloak User Management',
  description: 'Example dashboard app built using the components.',
}

import { Payment, columns } from './columns'
import { DataTable } from './data-table'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: 'e927c8a1',
      amount: 100,
      status: 'pending',
      email: 'n@example.com',
    },
    {
      id: '1a4f09d7',
      amount: 100,
      status: 'pending',
      email: 'o@example.com',
    },
    {
      id: '6bc3e91d',
      amount: 100,
      status: 'pending',
      email: 'p@example.com',
    },
    {
      id: '3fba1e8c',
      amount: 100,
      status: 'pending',
      email: 'q@example.com',
    },
    {
      id: 'eaf9c6b3',
      amount: 100,
      status: 'pending',
      email: 'r@example.com',
    },
    {
      id: '32d7c958',
      amount: 100,
      status: 'pending',
      email: 's@example.com',
    },
    {
      id: '9e65ab71',
      amount: 100,
      status: 'pending',
      email: 't@example.com',
    },
    {
      id: 'b3f1c8e2',
      amount: 100,
      status: 'pending',
      email: 'w@example.com',
    },
    {
      id: 'b3f1c8e2',
      amount: 100,
      status: 'pending',
      email: 'z@example.com',
    },
    {
      id: 'b3f1c8e2',
      amount: 100,
      status: 'pending',
      email: 'w@example.com',
    },
    {
      id: 'b3f1c8e2',
      amount: 100,
      status: 'pending',
      email: 'z@example.com',
    },
  ]
}

export default async function DashboardPage() {
  const data = await getData()

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold'>Users</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
