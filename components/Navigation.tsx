'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { headerItems } from '@/constants'

const Navigation = () => {
  const pathname = usePathname()
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {headerItems.map(({ label, url }, key) => (
          <NavigationMenuItem key={key}>
            <NavigationMenuLink
              href={url}
              className={cn(
                navigationMenuTriggerStyle(),
                'hover:text-primary focus:text-primary bg-transparent text-base hover:bg-transparent focus:bg-transparent',
                {
                  'text-primary':
                    pathname == url || pathname?.startsWith(`${url}/`),
                },
              )}
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default Navigation
