import Link from 'next/link'
import React from 'react'
import Logo from './Logo'
import NewsletterForm from './NewsletterForm'

const Footer = () => {
  return (
    <footer className="bg-accent border-t">
      <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-8 md:px-16">
        <div className="flex flex-wrap items-start gap-8 lg:flex-nowrap lg:gap-0">
          <div className="w-full space-y-1.5 md:mr-14 md:max-w-60">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Unlock your event experience with our platform. Buy, sell, and
              explore events in your area.
            </p>
          </div>
          <div className="w-full md:mr-14 md:max-w-40">
            <h3 className="mb-4 text-lg font-semibold uppercase">
              Quick Links
            </h3>
            <div className="grid gap-2 text-sm">
              <Link
                href="/events"
                className="text-muted-foreground hover:text-foreground"
              >
                Browse Events
              </Link>
              <Link
                href="/user/events/create"
                className="text-muted-foreground hover:text-foreground"
              >
                Create Event
              </Link>
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="w-full md:max-w-48">
            <h3 className="mb-4 text-lg font-semibold uppercase">Support</h3>
            <div className="grid gap-2 text-sm">
              <Link
                href="/how-it-works"
                className="text-muted-foreground hover:text-foreground"
              >
                How It Works
              </Link>
              <Link
                href="/help-center"
                className="text-muted-foreground hover:text-foreground"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="text-muted-foreground hover:text-foreground"
              >
                FAQ
              </Link>
             
            </div>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <div className="text-muted-foreground mt-8 border-t py-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} E-BOX. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
