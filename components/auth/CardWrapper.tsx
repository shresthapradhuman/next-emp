import React, { ReactNode } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SocialLoginButton from './SocialLoginButton'

interface CardWrapperProps {
  title: string
  description?: string
  question?: string
  redirectLink?: string
  redirectTitle?: string
  socialLogin?: boolean
  children: ReactNode
}

const CardWrapper = ({
  title,
  description,
  question,
  redirectLink,
  redirectTitle,
  socialLogin,
  children,
}: CardWrapperProps) => {
  return (
    <div className="flex items-center justify-center p-4 py-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {socialLogin && (
          <CardFooter className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>
            {/* social login buttons */}
            <SocialLoginButton />
          </CardFooter>
        )}
        <CardFooter>
          <div className="w-full text-center text-sm">
            {question}
            <Link
              href={redirectLink || '#'}
              className="text-primary mx-1 hover:underline"
            >
              {redirectTitle}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CardWrapper
