'use client'
import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  // check url: /dashboard or /
  // if /dashboard, set the Dashboard link to active
  // if /, set the Home link to active
  const path = usePathname()

  return (
    <div className='w-full ml-aauto mt-6 ml-6'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href={path === '/dashboard' ? '/' : '/dashboard'}
              legacyBehavior
              passHref
            >
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={false}
              >
                {path === '/dashboard' ? 'Home' : 'Dashboard'}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navigation
