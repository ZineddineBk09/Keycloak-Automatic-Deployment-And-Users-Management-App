'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'

const CheckAuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const protectedRoutes = ['dashboard']
  const router = useRouter()
  const path = usePathname().replace('/', '')

  // useEffect(() => {
  //   if (status == 'loading') return
  //   console.log(status)

  //   if (status == 'unauthenticated' && protectedRoutes.includes(path)) {
  //     console.log('no session')
  //     router.push('/')
  //   }

  //   if (status === 'authenticated' && isExpired && decodedToken) {
  //     console.log('session expired')
  //     signOut()
  //     router.push('/')
  //   }

  //   if (status === 'authenticated' && path === '' && !isExpired) {
  //     console.log('session exists')
  //     router.push('/dashboard')
  //   }
  // }, [status, isExpired])

  // if (status === 'loading') return 'Loading...'

  return children
}

export default CheckAuthGuard
