import React from 'react'
import { Input } from '../ui/input'
import { useKeycloakConfigurationContext } from '../../context/keycloak-config'
/**
 *
 * Realm Settings:
 *  realm: input field, with default value 'myrealm'
 *  displayName: input field, with default value 'My Realm'
 */

const RealmSettings = () => {
  const { config, setConfig } = useKeycloakConfigurationContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='container flex flex-col gap-y-4'>
      <div className='flex flex-col'>
        <label className='text-sm'>Realm Name</label>
        <Input
          name='realm'
          value={config.realm}
          onChange={handleChange}
        />
      </div>

      <div className='flex flex-col'>
        <label className='text-sm'>
          Display Name <span className='text-xs'>(HTML)</span>
        </label>
        <Input
          name='displayName'
          value={config.displayName}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default RealmSettings
