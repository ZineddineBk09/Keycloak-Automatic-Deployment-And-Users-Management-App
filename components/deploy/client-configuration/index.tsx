import React from 'react'
import { DataTable } from '../../ui/data-table'
import { columns } from './columns'
import { Client } from '../../../interfaces/keycloak'
import AddClient from './add-client'
import { useKeycloakConfigurationContext } from '../../../context/keycloak-config'

const ClientConfiguration = () => {
  const { config } = useKeycloakConfigurationContext()
  return (
    <div className='container '>
      <DataTable
        columns={columns}
        data={config.clients as Client[]}
        Action={() => (
          <>
            <AddClient />
          </>
        )}
      />
    </div>
  )
}

export default ClientConfiguration
