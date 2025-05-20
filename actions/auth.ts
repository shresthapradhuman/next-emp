'use server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateUserSchema,
} from '@/schema'
import {
  createUser,
  deleteVerification,
  generatePasswordResetToken,
  generateVerificationToken,
  getUserByEmail,
  getUserByToken,
  getVerificationToken,
  resetUserPassword,
  updateUser,
  verifyUser,
} from '@/helper/auth'
import config from '@/lib/config'
import { resend } from '@/lib/resend'
import EmailVerification from '@/templates/EmailVerification'
import { auth, signIn, signOut } from '@/auth'
import { DEFAULT_REDIRECT_URL } from '@/routes'
import { AuthError } from 'next-auth'
import ResetPassword from '@/templates/ResetPassword'

export const registerAction = async (
  values: z.infer<typeof registerSchema>,
) => {
  try {
    const { data, success } = registerSchema.safeParse(values)
    if (!success)
      return {
        success: false,
        message: 'Invalid field data',
      }
    const checkUser = await getUserByEmail(data.email)
    if (checkUser)
      return {
        success: false,
        message: 'Email already exists',
      }
    const hashPassword = await bcrypt.hash(data.password, 10)

    const newUser = await createUser({
      name: data.name.toLowerCase(),
      email: data.email.toLowerCase(),
      password: hashPassword,
    })

    if (!newUser) {
      return {
        success: false,
        message: 'Failed to register user',
      }
    }
    if (!newUser.emailVerified) {
      const { token } = await generateVerificationToken(newUser.email)
      const url = `${config.baseUrl}/email-verify?token=${token}`
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: newUser.email.toLowerCase().trim(),
        subject: 'verify your email',
        react: EmailVerification(url, newUser.name!),
      })
    }
    return {
      success: true,
      message:
        'User registered successfully. Please check your email to verify your account.',
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return {
      success: false,
      message: 'Internal server error',
    }
  }
}

export const loginAction = async (
  values: z.infer<typeof loginSchema>,
  callbackUrl?: string,
) => {
  const { data, success } = loginSchema.safeParse(values)
  if (!success) return { success: false, message: 'Invalid field data.' }
  const checkUser = await getUserByEmail(data.email)
  /** check user exist or not */
  if (!checkUser || !checkUser.email || !checkUser.password) {
    return { success: false, message: "Email doesn't exist." }
  }
  /** check user is emailVerified or not */
  if (!checkUser.emailVerified) {
    /** generate the new token */
    const { token } = await generateVerificationToken(checkUser.email)
    const url = `${config.baseUrl}/email-verify?token=${token}`
    /** resend the verification email */
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: checkUser.email.toLowerCase().trim(),
      subject: 'verify your email',
      react: EmailVerification(url, checkUser.name as string),
    })
    return {
      success: false,
      message:
        'Please verify your email to access your account. Check your inbox or click below to resend the verification email.',
    }
  }
  /** check user is matched */
  const matchPassword = await bcrypt.compare(data.password, checkUser.password)
  if (!matchPassword) {
    return {
      success: false,
      message: 'Wrong email and password combination.',
    }
  }
  try {
    await signIn('credentials', {
      email: data?.email,
      password: data?.password,
      redirectTo: callbackUrl || DEFAULT_REDIRECT_URL,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.message === 'Invalid Credentials') {
        return { success: false, message: 'Invalid Credentials' }
      }
      return { success: false, message: 'Something went wrong' }
    }
    throw error
  }
}

export const emailVerifiedAction = async (token: string) => {
  const existingToken = await getVerificationToken(token)
  if (!existingToken) return { error: 'Token does not exist.' }
  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) return { success: false, message: 'Token has expired.' }
  const existingUser = await getUserByToken(existingToken.identifier)
  if (!existingUser) return { success: false, message: 'Email does not exist.' }
  await verifyUser(existingUser?.id, existingUser?.email)
  await deleteVerification(existingToken.identifier, existingToken.token)
  if (existingUser) {
    await signIn('credentials', {
      email: existingUser?.email,
      password: existingUser?.password,
    })
    return {
      success: true,
      message: 'User verified successfully.',
    }
  }
}

export const forgotPasswordAction = async (
  values: z.infer<typeof forgotPasswordSchema>,
) => {
  try {
    const { data, success } = forgotPasswordSchema.safeParse(values)
    if (!success)
      return {
        success: false,
        message: 'Invalid field data',
      }
    /** check user exist */
    const user = await getUserByEmail(data.email)
    if (!user)
      return {
        success: false,
        message: "User with email doesn't exist.",
      }
    /** generate the reset token */
    const token = await generatePasswordResetToken(user.email)
    const url = `${config.baseUrl}/reset-password?token=${token.token}`
    /** send password reset mail */
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email.toLowerCase().trim(),
      subject: 'verify your email',
      react: ResetPassword({ name: user.name || '', url }),
    })
    return {
      success: true,
      message:
        'Password reset email sent successfully. Please check your inbox.',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Internal server error',
    }
  }
}

export const resetPasswordAction = async (
  values: z.infer<typeof resetPasswordSchema>,
  token: string,
) => {
  try {
    if (!token) return { success: false, message: 'Token is missing.' }
    const { data, success } = resetPasswordSchema.safeParse(values)
    if (!success) return { success: false, message: 'Invalid field data.' }
    const existingToken = await getVerificationToken(token)
    if (!existingToken) return { success: false, message: 'Invalid token.' }
    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return { success: false, message: 'Token has expired.' }
    const existingUser = await getUserByEmail(existingToken.identifier)
    if (!existingUser) return { success: false, message: 'Unauthorized user.' }
    const hashPassword = await bcrypt.hash(data.password, 10)
    const userUpdate = await resetUserPassword(existingUser.email, hashPassword)
    if (!userUpdate)
      return {
        success: false,
        message: 'Something went wrong.',
      }
    await deleteVerification(existingToken.identifier, token)
    return {
      success: true,
      message: 'Password updated successfully.',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Internal server error.',
    }
  }
}

export const logoutAction = async () => {
  await signOut()
}

export const updateUserAction = async (
  values: z.infer<typeof updateUserSchema>,
) => {
  try {
    const session = await auth()
    if (!session?.user)
      return {
        success: false,
        message: 'Invalid User',
      }
    const { data, success } = updateUserSchema.safeParse(values)
    if (!success)
      return {
        success: false,
        message: 'Invalid form data',
      }
    const checkUser = await getUserByEmail(data.email)
    if (!checkUser)
      return {
        success: false,
        message: 'Unauthorized User',
      }
    if (data.currentPassword && data.password) {
      const comparePassword = await bcrypt.compareSync(
        data.currentPassword,
        checkUser.password as string,
      )
      if (!comparePassword)
        return {
          success: false,
          message: 'Current password dont match',
        }
      const hashPassword = await bcrypt.hash(data.password, 10)
      data.password = hashPassword
    }
    const newUser = await updateUser(session.user.id!, data)
    if (!newUser)
      return {
        success: false,
        message: 'Something went wrong while updating user.',
      }
    return {
      success: true,
      message: 'User has been successfully updated',
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Something went wrong. Internal server errror',
    }
  }
}
