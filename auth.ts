import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from './auth.config'
import { getUserById } from './helper/auth'
import prisma from './prisma/client'

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    error: '/error',
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true
      const existingUser = await getUserById(user.id)
      if (!existingUser?.emailVerified) return false
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.user.contact = token.contact as string
        session.user.bio = token.bio as string
      }
      return session
    },
    async jwt({ token }) {
      if (!token) return token
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token
      token.name = existingUser.name
      token.email = existingUser.email
      token.image = existingUser.image
      token.contact = existingUser.contact
      token.bio = existingUser.bio
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  ...authConfig,
})
