'use client'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { emailVerifiedAction } from '@/actions/auth'

const EmailVerificationFormContent = () => {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const onSubmit = useCallback(() => {
    if (success || error) return
    if (!token) {
      setError('Missing token')
      return
    }
    emailVerifiedAction(token)
      .then((data) => {
        setSuccess(data?.message as string)
        setError(data?.error as string)
      })
      .catch(() => {
        setError('Something went wrong')
      })
  }, [error, success, token])
  useEffect(() => {
    onSubmit()
  }, [onSubmit])
  return (
    <div className="grid gap-4 text-center">
      <h3>🎉 Email Verified Successfully!</h3>
      <p className="text-green-900">
        Thank you for verifying your email. Your account is now active, and you
        can start using all the features. Welcome aboard!
      </p>
      <Link href={'/'}>
        <Button className="group">
          Return To Home
          <ArrowRight
            className="ms-2 -me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </Link>
    </div>
  )
}

export default function EmailVerificationForm() {
  return (
    <Suspense>
      <EmailVerificationFormContent />
    </Suspense>
  )
}
