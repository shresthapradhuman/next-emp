'use client'
import React from 'react'
import Link from 'next/link'
import { User } from 'next-auth'
import { logoutAction } from '@/actions/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { profileItems } from '@/constants'
import { LogOutIcon } from 'lucide-react'

const UserDropdown = ({ user }: { user: User }) => {
  const handleLogout = async () => {
    await logoutAction()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-accent cursor-pointer rounded-full border-2">
        <Avatar className="bg-background relative flex items-center justify-center overflow-hidden border p-0.5">
          <AvatarImage
            src={user.image || ''}
            alt={'avatar'}
            className="rounded-full object-cover"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64" sideOffset={10}>
        <DropdownMenuLabel>
          <h3 className="text-base font-semibold">{user.name}</h3>
          <p className="text-muted-foreground truncate text-sm">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profileItems.map(({ label, url, icon: Icon }, key) => (
          <DropdownMenuItem
            asChild
            className="cursor-pointer capitalize"
            key={key}
          >
            <Link href={`/user/${url}`}>
              <Icon /> {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
