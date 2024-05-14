import { createContext, useContext, useEffect, useState } from 'react'
import { KeycloakUser } from '../interfaces'
import { toast } from 'sonner'
import { getRecords, deleteRecord } from '../lib/api/keycloak'
import { useCookies } from 'react-cookie'

export const UsersContext = createContext({})

export const useUsersContext: {
  (): {
    users: KeycloakUser[]
    setUsers: React.Dispatch<React.SetStateAction<KeycloakUser[]>>
    fetchUsers: () => Promise<void>
    deleteUsers: (ids: string[]) => Promise<void>
  }
} = () => useContext(UsersContext as React.Context<any>)

export const UsersContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [users, setUsers] = useState<KeycloakUser[]>([] as KeycloakUser[])
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])

  const fetchUsers = async () => {
    // call the create user API
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          'Please check if the Keycloak server is running. and try again.'
        )
      }

      const response = await getRecords('users')
      setUsers(response)
    } catch (error: any) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  const deleteUsers = async (ids: string[]) => {
    try {
      if (!cookies?.kc_session)
        throw new Error(
          'Please check if the Keycloak server is running. and try again.'
        )

      await Promise.all(ids.map((id) => deleteRecord('users', id)))
      await fetchUsers()
    } catch (error: any) {
      console.error('Error deleting users:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchUsers()
      .then(() => {
        toast.success('Users fetched')
      })
      .catch((error) => {
        console.log('Error fetching users:', error)
        toast.error(error.message)
      })
  }, [cookies?.kc_session])

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        fetchUsers,
        deleteUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
