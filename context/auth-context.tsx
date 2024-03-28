import { ClientSession } from '@/interfaces'
import { getAccessToken } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

export const AuthContext = createContext<any>(null)

export const useAuth: {
  (): {
    session: ClientSession
    loading: boolean
    setSession: React.Dispatch<React.SetStateAction<ClientSession>>
    refreshToken: () => Promise<void>
  }
} = () => useContext(AuthContext as React.Context<any>)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<ClientSession>({} as any)
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])
  const [loading, setLoading] = useState<boolean>(false)

  const refreshToken = async () => {
    // check if cookie exists
    if (cookies.kc_session) {
      // set session from cookie
      setSession({
        access_token: cookies.kc_session,
      } as ClientSession)
    } else {
      // get token from keycloak
      setLoading(true)
      const clientSession: ClientSession = await getAccessToken()
      setSession(clientSession)
      // save session to cookie
      setCookie('kc_session', clientSession.access_token, {
        path: '/',
        maxAge: clientSession.expires_in,
      })
      setLoading(false)
    }
  }
  useEffect(() => {
    refreshToken()

    const refreshInterval = setInterval(() => {
      refreshToken()
    }, 1000 * 60) // 1 minute

    return () => clearInterval(refreshInterval)
  }, [])

  return (
    <AuthContext.Provider
      value={{ session, loading, setSession, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
