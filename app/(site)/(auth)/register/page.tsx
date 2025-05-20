import CardWrapper from '@/components/auth/CardWrapper'
import RegisterForm from '@/components/auth/RegisterForm'
import React from 'react'

const RegisterPage = () => {
  return (
    <CardWrapper
      title={'Create an account!'}
      description="Enter information below to create your account."
      question="Already have an account?"
      redirectLink="/login"
      redirectTitle="Login"
      socialLogin={false}
    >
      <RegisterForm />
    </CardWrapper>
  )
}

export default RegisterPage
