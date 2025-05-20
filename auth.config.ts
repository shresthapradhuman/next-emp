import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { loginSchema } from '@/schema'
import { getUserByEmail } from './helper/auth'

export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials)
        if (success) {
          const user = await getUserByEmail(data.email)
          if (!user || !user.password) {
            throw new Error('Invalid Credentials.')
          }
          return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
