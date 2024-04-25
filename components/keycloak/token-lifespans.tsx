import React from 'react'
import { Input } from '../ui/input'
import { useKeycloakConfigurationContext } from '../../context/keycloak-config'

const TokenLifespans = () => {
  const { config, setConfig } = useKeycloakConfigurationContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='container '>
      <div className='flex flex-col gap-y-4'>
        <div className='flex flex-row gap-x-4'>
          <div className='flex flex-col w-1/2'>
            <label className='text-sm'>Access Token Lifespan</label>
            <Input
              name='accessTokenLifespan'
              value={config.accessTokenLifespan}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col w-1/2'>
            <label className='text-sm'>
              Access Token Lifespan for Implicit Flow
            </label>
            <Input
              name='accessTokenLifespanForImplicitFlow'
              value={config.accessTokenLifespanForImplicitFlow}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex flex-row gap-x-4'>
          <div className='flex flex-col w-1/2'>
            <label className='text-sm'>Refresh Token Max Reuse</label>
            <Input
              name='refreshTokenMaxReuse'
              value={config.refreshTokenMaxReuse}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col w-1/2'>
            <label className='text-sm'>Offline Session Idle Timeout</label>
            <Input
              name='offlineSessionIdleTimeout'
              value={config.offlineSessionIdleTimeout}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenLifespans
