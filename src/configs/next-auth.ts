import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"

import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/prisma"

import axios from "axios" // import axios

// Extend NextAuth's Session and User interfaces
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      avatar: string | null
      status: string
      role: string
    }
  }

  interface User {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
    role: string
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const response = await axios.post(
            `${process.env.API_URL}/auth/admin/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )


          return response.data
        } catch (error: any) {
          console.error("Login error:", error.response?.data ?? error.message ?? error)
          throw new Error(
            error.response?.data?.message ??
            error.message ??
            "An unknown error occurred during login"
          )
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.avatar = user.avatar
        token.email = user.email
        token.status = user.status
        token.role = user.role ?? "admin"
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.avatar = token.avatar
        session.user.email = token.email
        session.user.status = token.status
        session.user.role = token.role
      }
      return session
    },
  },
}
