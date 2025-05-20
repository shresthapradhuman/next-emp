import React from 'react'
import AuthenticationButton from './AuthenticationButton'
import UserDropdown from './UserDropdown'
import Navigation from './Navigation'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import { auth } from '@/auth'

const Header = async () => {
  const session = await auth()
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 h-16 w-full border-b backdrop-blur">
      <nav className="container mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 md:px-16">
        {/* logo section */}
        <Logo />
        {/* desktop navigation section */}
        <Navigation />
        <div className="flex items-center gap-4">
          {/* user dropdown and authentication button section */}
          <div className="hidden md:flex">
            {session ? (
              <UserDropdown user={session?.user} />
            ) : (
              <AuthenticationButton />
            )}
          </div>
          {/* mobile menu section */}
          <MobileMenu user={session?.user} />
        </div>
      </nav>
    </header>
  )
}

export default Header
