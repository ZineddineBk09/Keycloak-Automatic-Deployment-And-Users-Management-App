import React from 'react'
import { ClientLoginForm } from '../../components/client/login-form'

const page = () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-10'>
        Config
      </h1>
      <ClientLoginForm />
    </div>
  )
}

export default page
