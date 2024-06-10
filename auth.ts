import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUser, getUserById } from "@/data/user"
import { UserRole } from "@prisma/client"




export const {
  handlers: { GET, POST },
  auth, signIn, signOut,
} = NextAuth({
  pages: {
    signIn: "/admin/login"
  }
  ,
  callbacks: {
    async signIn({ user, account }) {
      // allow
      const existingUser = await getUserById(user.id as string)
      if (!existingUser) return false
      return true
    }
    ,
    async session({ token, session, user }) {
      if (token.sub && session.user && session.user) {
        session.user.id = token.sub
        // @ts-ignore
        session.user.name = token.username
        //  @ts-ignore
        session.user.role = token.role
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token
      const user = await getUserById(token.sub)
      if (!user) return token;
      token.role = user.role
      token.username = user.username
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,

})