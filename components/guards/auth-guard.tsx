'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'
import { useCookies } from 'react-cookie'

const CheckAuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const protectedRoutes = ['upload', 'users', 'clients', 'settings']
  const router = useRouter()
  const path = usePathname().replace('/', '')
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])

  useEffect(() => {
    if (protectedRoutes.includes(path) && !cookies.kc_session) {
      router.push('/login')
    }
    if (!protectedRoutes.includes(path) && cookies.kc_session) {
      router.push('/users')
    }
  }, [path, cookies.kc_session])

  return children
}

export default CheckAuthGuard
