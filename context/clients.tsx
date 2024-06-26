import { createContext, useContext, useEffect, useState } from 'react'
import { KeycloakUser } from '../interfaces'
import { toast } from 'sonner'
import { getRecords, deleteRecord } from '../lib/api/keycloak'
import { useCookies } from 'react-cookie'

export const ClientsContext = createContext({})

export const useClientsContext: {
  (): {
    clients: KeycloakUser[]
    setClients: React.Dispatch<React.SetStateAction<KeycloakUser[]>>
    fetchClients: () => Promise<void>
    deleteClients: (ids: string[]) => Promise<void>
  }
} = () => useContext(ClientsContext as React.Context<any>)

export const ClientsContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [clients, setClients] = useState<KeycloakUser[]>([] as KeycloakUser[])
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])

  const fetchClients = async () => {
    // call the create user API
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          'You need to login to Keycloak to fetch clients. Please login and try again.'
        )
      }

      const response = await getRecords('clients')
      setClients(response)
    } catch (error: any) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  const deleteClients = async (ids: string[]) => {
    try {
      if (!cookies?.kc_session)
        throw new Error(
          'You need to login to Keycloak to delete clients. Please login and try again.'
        )

      await Promise.all(ids.map((id) => deleteRecord('clients', id)))
      await fetchClients()
    } catch (error: any) {
      console.error('Error deleting clients:', error)
      throw error
    }
  }

  useEffect(() => {
    if (!cookies?.kc_session) return
    fetchClients()
      .then(() => {
        toast.success('Clients fetched')
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }, [cookies?.kc_session])

  return (
    <ClientsContext.Provider
      value={{
        clients,
        setClients,
        fetchClients,
        deleteClients,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}
