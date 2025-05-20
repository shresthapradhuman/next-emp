import CardWrapper from '@/components/auth/CardWrapper'
import LoginForm from '@/components/auth/LoginForm'
import React from 'react'

const LoginPage = () => {
  return (
    <CardWrapper
      title={'Welcome Back!'}
      description="Login to access your account"
      question="Don't have an account?"
      redirectLink="/register"
      redirectTitle="Register"
      socialLogin={true}
    >
      <LoginForm />
    </CardWrapper>
  )
}

export default LoginPage
