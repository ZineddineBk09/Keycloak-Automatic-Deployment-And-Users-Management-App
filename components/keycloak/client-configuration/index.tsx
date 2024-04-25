import React from 'react'
import { DataTable } from '../../../components/ui/data-table'
import { columns } from './columns'
import { Client } from '../../../interfaces/keycloak'
import { TableIcon } from '@radix-ui/react-icons'
import { Button } from '../../../components/ui/button'

const ClientConfiguration = () => {
  return (
    <div className='container '>
      <DataTable
        columns={columns}
        data={[] as Client[]}
        Action={() => (
          <Button variant='outline' type='button'>
            Upload CSV
            <TableIcon
              className='h-5 w-5 text-gray-500 ml-2'
              aria-hidden='true'
            />
          </Button>
        )}
      />
    </div>
  )
}

export default ClientConfiguration
