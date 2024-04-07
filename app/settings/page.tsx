import React from 'react'
import { ClientSettingsForm } from '../../components/client/settings-form'

const page = () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-2'>Settings</h1>
      <p className='text-sm text-slate-500 dark:text-slate-400 mb-10'>
        Configure your client settings. changes will not be reflected on the
        keycloak server.
      </p>
      <ClientSettingsForm />
    </div>
  )
}

export default page
