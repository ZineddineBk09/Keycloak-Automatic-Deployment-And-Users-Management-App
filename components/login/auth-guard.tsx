'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'

const CheckAuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const protectedRoutes = ['dashboard']
  const router = useRouter()
  const path = usePathname().replace('/', '')

  return children
}

export default CheckAuthGuard
