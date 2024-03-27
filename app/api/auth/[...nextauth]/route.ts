import { AuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || '',
      issuer: process.env.NEXT_PUBLIC_KEYCLOAK_URL || '',
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
