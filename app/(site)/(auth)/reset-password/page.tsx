import CardWrapper from '@/components/auth/CardWrapper'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import React from 'react'

const page = () => {
  return (
    <CardWrapper
      title="Reset Password"
      description="Reset your password with new password"
      question="Remember Password? "
      redirectLink="/login"
      redirectTitle="Log In"
    >
      <ResetPasswordForm />
    </CardWrapper>
  )
}

export default page
