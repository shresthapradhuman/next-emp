'use client'
import React from 'react'
import Link from 'next/link'
import { User } from 'next-auth'
import AuthenticationButton from './AuthenticationButton'
import { headerItems, profileItems } from '@/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronUpIcon, LogOutIcon, MenuIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { logoutAction } from '@/actions/auth'

const MobileMenu = ({ user }: { user: User | undefined }) => {
  const handleLogout = async () => {
    await logoutAction()
  }
  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer md:hidden">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent className="w-64">
        <SheetHeader>
          <SheetTitle className="sr-only">Sheet Header</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          {headerItems.map(({ label, url, icon: Icon }, key) => (
            <SheetClose key={key}>
              <Link href={url} className="flex items-center gap-4">
                <Icon size={16} />
                {label}
              </Link>
            </SheetClose>
          ))}
        </div>
        <SheetFooter className="border-t">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || ''} alt="avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="w-36 text-left font-medium">
                  <h3 className="truncate text-sm">Pradhuman Shrestha</h3>
                  <p className="truncate text-xs">
                    shresthapradhuman2018@gmail.com
                  </p>
                </div>
                <ChevronUpIcon className="ml-auto h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={20}
                alignOffset={-5}
                className="w-56"
              >
                {profileItems.map(({ label, url, icon: Icon }, key) => (
                  <DropdownMenuItem asChild key={key}>
                    <Link href={`/user/${url}`}>
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthenticationButton />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
