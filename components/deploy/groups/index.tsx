import React from 'react'
import { DataTable } from '../../ui/data-table'
import { columns } from './columns'
import { Group } from '../../../interfaces/keycloak'
import { TableIcon } from '@radix-ui/react-icons'
import { Button } from '../../ui/button'

const Groups = () => {
  return (
    <div className='container '>
      <DataTable
        columns={columns}
        data={[] as Group[]}
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

export default Groups
