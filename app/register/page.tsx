'use client'
import React from 'react'
import { ClientRegisterForm } from '../../components/client/register-form'

export default function RegisterPage() {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-10'>Register your client</h1>
      <ClientRegisterForm />
    </div>
  )
}
