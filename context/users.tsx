import { createContext, use, useContext, useEffect, useState } from 'react'
import { KeycloakUser } from '../interfaces'
import { useAuth } from './auth-context'
import { toast } from 'sonner'
import { getUsers, deleteUser } from '../lib/api'

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
  const { session, loading } = useAuth()

  const fetchUsers = async () => {
    // call the create user API
    try {
      if (!session?.access_token && !loading)
        throw new Error(
          'Please check if the Keycloak server is running. and try again.'
        )
      if (loading) {
        toast.error('Loading...')
        return
      }
      const response = await getUsers(session?.access_token || '')
      setUsers(response)
    } catch (error: any) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  const deleteUsers = async (ids: string[]) => {
    try {
      if (!session?.access_token && !loading)
        throw new Error(
          'Please check if the Keycloak server is running. and try again.'
        )
      if (loading) {
        toast.error('Loading...')
        return
      }
      await Promise.all(
        ids.map((id) => deleteUser(id, session?.access_token || ''))
      )
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
        toast.error(error.message)
      })
  }, [session])

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
