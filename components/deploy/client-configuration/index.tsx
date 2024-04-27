import React from 'react'
import { DataTable } from '../../ui/data-table'
import { columns } from './columns'
import { Client } from '../../../interfaces/keycloak'
import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '../../ui/button'

const ClientConfiguration = () => {
  return (
    <div className='container '>
      <DataTable
        columns={columns}
        data={[] as Client[]}
        Action={() => (
          <Button variant='outline' type='button'>
            Add Client
            <PlusIcon
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
