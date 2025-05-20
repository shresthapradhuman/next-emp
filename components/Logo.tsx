'use client'
import React from 'react'
import Link from 'next/link'
import { BoxIcon } from 'lucide-react'

const Logo = () => {
  return (
    <h1 className="text-xl font-bold tracking-tight">
      <Link href={'/'} className="text-secondary flex items-center">
        E-B
        <BoxIcon
          size={24}
          className="stroke-accent-foreground mx-0.5 -mt-0.5 stroke-2"
        />{' '}
        X
      </Link>
    </h1>
  )
}

export default Logo
