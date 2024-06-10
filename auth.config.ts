
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from './schemas'
import { getUser } from './data/user'
import bcrypt from "bcryptjs"
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'


export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { username, password } = validatedFields.data;
          const user = await getUser(username)
          if (!user || !user.password) return null
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (passwordMatch) return user
        }
        return null;
      }
    })],
} satisfies NextAuthConfig