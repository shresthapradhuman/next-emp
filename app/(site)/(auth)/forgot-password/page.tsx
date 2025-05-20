import CardWrapper from '@/components/auth/CardWrapper'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import React from 'react'

const ForgotPasswordPage = () => {
  return (
    <CardWrapper
      title={'Forgot Password'}
      description="Enter your email to receive reset password email."
      question="Remember Password?"
      redirectLink="/login"
      redirectTitle="Login"
      socialLogin={false}
    >
      <ForgotPasswordForm />
    </CardWrapper>
  )
}

export default ForgotPasswordPage
