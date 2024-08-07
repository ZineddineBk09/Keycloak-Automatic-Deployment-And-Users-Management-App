'use client'

import React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  // check url: /users or /
  // if /users, set the Dashboard link to active
  // if /, set the Home link to active
  const path = usePathname()

  return (
    <div className='w-full ml-aauto mt-6 ml-6'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href={path === '/users' ? '/' : '/users'}
              legacyBehavior
              passHref
            >
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={false}
              >
                {path === '/users' ? 'Upload' : 'Users'}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navigation
