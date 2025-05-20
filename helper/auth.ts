'use server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { registerSchema, updateUserSchema } from '@/schema'
import { User } from 'next-auth'
import prisma from '@/prisma/client'

export const getUserById = async (id: User['id']) => {
  return await prisma.user.findFirst({
    where: {
      id,
    },
  })
}

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  })
}

export const getUserByToken = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  })
}

export const createUser = async (data: z.infer<typeof registerSchema>) => {
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  })
}

export const resetUserPassword = async (email: string, password: string) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      password,
    },
  })
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour from now

  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
    },
  })

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token,
        },
      },
    })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return verificationToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)
  const exisitingToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
    },
  })
  if (exisitingToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: exisitingToken.identifier,
          token: exisitingToken.token,
        },
      },
    })
  }

  const passwordResetToken = await prisma.verificationToken.create({
    data: {
      token,
      identifier: email,
      expires,
    },
  })
  return passwordResetToken
}

export const getVerificationToken = async (token: string) => {
  return await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  })
}

export const verifyUser = async (id: string, email: string) => {
  await prisma.user.update({
    where: { id },
    data: {
      emailVerified: new Date(),
      email,
    },
  })
}

export const deleteVerification = async (identifier: string, token: string) => {
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  })
}

export const updateUser = async (
  id: string,
  data: z.infer<typeof updateUserSchema>,
) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      email: data.email.toLowerCase(),
      name: data.name,
      image: data.image,
      contact: data.contact,
      bio: data.bio,
      ...(data.password ? { password: data.password } : {}),
    },
  })
}
