import { ClientSession } from '@/interfaces'
import { getAccessToken } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

export const AuthContext = createContext<any>(null)

export const useAuth: {
  (): {
    session: ClientSession
    setSession: React.Dispatch<React.SetStateAction<ClientSession>>
    refreshToken: () => Promise<void>
  }
} = () => useContext(AuthContext as React.Context<any>)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<ClientSession>({} as any)
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])

  const refreshToken = async () => {
    // check if cookie exists
    if (cookies.kc_session) {
      // set session from cookie
      setSession({
        access_token: cookies.kc_session,
      } as ClientSession)
    } else {
      // get token from keycloak
      const clientSession: ClientSession = await getAccessToken()
      setSession(clientSession)
      // save session to cookie
      setCookie('kc_session', clientSession.access_token, {
        path: '/',
        maxAge: clientSession.expires_in,
      })
    }
  }
  useEffect(() => {
    refreshToken()
  }, [])

  return (
    <AuthContext.Provider value={{ session, setSession, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
