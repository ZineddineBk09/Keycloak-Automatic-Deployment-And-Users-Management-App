import { createContext, use, useContext, useEffect, useState } from 'react'
import { KeycloakUser } from '@/interfaces'
import { useAuth } from './auth-context'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getUsers } from '@/lib/api'

export const UsersContext = createContext({})

export const useUsersContext: {
  (): {
    users: KeycloakUser[]
    setUsers: React.Dispatch<React.SetStateAction<KeycloakUser[]>>
    fetchUsers: () => Promise<void>
  }
} = () => useContext(UsersContext as React.Context<any>)

export const UsersContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [users, setUsers] = useState<KeycloakUser[]>([] as KeycloakUser[])
  const [loading, setLoading] = useState<boolean>(false)
  const { session } = useAuth()

  const fetchUsers = async () => {
    setLoading(true)
    // call the create user API
    try {
      if (!session?.access_token) throw new Error('No access token')
      const response = await getUsers(session?.access_token)
      setUsers(response)
    } catch (error: any) {
      console.error('Error fetching users:', error)
      throw error
    } finally {
      setLoading(false)
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
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
