'use client'
import React from 'react'
import { ClientLoginForm } from '../components/forms/login-form'

export default function LoginPage() {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-10'>
        Login with your client credentials
      </h1>
      <ClientLoginForm />
    </div>
  )
}