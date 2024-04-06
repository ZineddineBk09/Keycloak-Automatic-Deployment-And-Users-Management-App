import React from 'react'
import { ClientForm } from '../../components/client/register-form'

const page = () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-10'>
        Config
      </h1>
      <ClientForm />
    </div>
  )
}

export default page
