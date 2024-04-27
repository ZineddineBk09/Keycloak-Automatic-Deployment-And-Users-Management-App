import React, { CSSProperties } from 'react'
import { DataTable } from '../../ui/data-table'
import { columns } from './columns'
import { User } from '../../../interfaces/keycloak'
import { Button } from '../../ui/button'
import { TableIcon } from '@radix-ui/react-icons'
import { useCSVReader } from 'react-papaparse'

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  } as CSSProperties,

  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  } as CSSProperties,

  progressBarBackgroundColor: {
    backgroundColor: '#1e90ff',
  } as CSSProperties,
}

const UserConfiguration = () => {
  return (
    <div className='container '>
      <DataTable columns={columns} data={[] as User[]} Action={Action} />
    </div>
  )
}

const Action = () => {
  const { CSVReader } = useCSVReader()

  return (
    <Button variant='outline' type='button'>
      Upload CSV
      <TableIcon className='h-5 w-5 text-gray-500 ml-2' aria-hidden='true' />
    </Button>
  )
}

export default UserConfiguration
