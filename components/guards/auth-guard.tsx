'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { protectedRoutes } from '../../routes'

const CheckAuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const router = useRouter()
  const path = usePathname()
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])

  useEffect(() => {
    if (protectedRoutes.includes(path) && !cookies?.kc_session) {
      router.push('/')
    }
    // if (!protectedRoutes.includes(path) && cookies?.kc_session) {
    //   router.push('/users')
    // }
  }, [path, cookies?.kc_session])

  return children
}

export default CheckAuthGuard
