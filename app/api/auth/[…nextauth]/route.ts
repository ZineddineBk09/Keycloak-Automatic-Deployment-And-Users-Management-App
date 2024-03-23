import NextAuth, { RequestInternal } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
/**
 * an example response:
 * {
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBZ1duTkZhX2UtbmNzbklaX2d2TDlMRDNpQ1NITWhsMEZid2tuS2JLZ0UwIn0.eyJleHAiOjE3MTExODczNjcsImlhdCI6MTcxMTE4NzMwNywianRpIjoiYmU2N2IzZjQtNzM5Ni00OTE2LWFjZWQtMDM0YWIzYzJmNWJlIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMS4zNzo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOlsibWFzdGVyLXJlYWxtIiwiYWNjb3VudCJdLCJzdWIiOiJkMDRhNjExNi0xZGQ1LTQ4OTItOTdkZS00ZTRlNjAyOWUzZDciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1yZXN0LWNsaWVudCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtbWFzdGVyIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1hc3Rlci1yZWFsbSI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjE5Mi4xNjguMS40MiIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1hZG1pbi1yZXN0LWNsaWVudCIsImNsaWVudEFkZHJlc3MiOiIxOTIuMTY4LjEuNDIiLCJjbGllbnRfaWQiOiJhZG1pbi1yZXN0LWNsaWVudCJ9.gsUR4HDj0FJMAxKqrIceLzS8b0CJCGK5KcX9pEVa8wDWvmmVEL-6HnfrWq2OpGXIqZ8NUlbXe72_aKo59-AISSVYhK5oN7-iL4gpiPDgh2XjHN4HVCWVZegoDPiQEWlq_BrCusOZ18Oz0pTDPbchiaagiaPwOq6py4OxzyM5cAk4O8W7e5htLzSCdyTJE-GlaldSfvZHof083ePqFjM8v0MVE0Jz3sOPYOBGoOyeQKN8c2Abs0TX53u9E4Qo-e1d8wxA4qw8semAzye3-76x929EpDrC7F5jikIMsOM2r-ytoOwuzsP3xntWajqooTsFb9bxHXaGPCxMp0wwB3hujA",
  "expires_in": 60,
  "refresh_expires_in": 0,
  "token_type": "Bearer",
  "not-before-policy": 0,
  "scope": "profile email"
}
 */
const handler = NextAuth({
  // Credentials Provider
  providers: [
    Credentials({
      name: 'Credentials',
      id: 'credentials',

      credentials: {
        clientId: { label: 'Client ID', type: 'text' },
        clientSecret: { label: 'Client Secret', type: 'password' },
      },

      async authorize(
        credentials: Record<'clientId' | 'clientSecret', string> | any,
        req: Pick<RequestInternal, 'method' | 'body' | 'query' | 'headers'>
      ): Promise<any> {
        const res = await fetch(process.env.NEXT_PUBLIC_CLIENT_AUTH_URL || '', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
          }),
        })
        const data = await res.json()

        if (res.ok && data) {
          return data
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/',
    error: '/404',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      return session
    },
  },
})

export { handler as GET, handler as POST }
