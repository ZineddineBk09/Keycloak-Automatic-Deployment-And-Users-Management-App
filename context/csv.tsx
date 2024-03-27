import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/interfaces'
import { useAuth } from './auth-context'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const UsersContext = createContext({})

export const useUsersContext: {
  (): {
    users: User[]
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
    uploadToKeycloak: () => void
    deleteUser: (username: string) => void
  }
} = () => useContext(UsersContext as React.Context<any>)

export const UsersContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [users, setUsers] = useState<User[]>([] as User[])
  const { session } = useAuth()
  const router = useRouter()

  const createUser = async (user: User) => {
    // call the create user API
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_KEYCLOAK_USERS_URL || '',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(user),
        }
      )
      if (!response.ok) {
        toast.error(`Failed to create user ${user.username}`)
        throw new Error('Failed to create user')
      }

      toast.success(`User ${user.username} created`)
      return {
        status: response.status,
        message: 'User created',
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  const uploadToKeycloak = async () => {
    try {
      const createdUsers = await Promise.all(
        users.map(async (user) => {
          return await createUser(user)
        })
      )
      setUsers([])
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error uploading users:', error)
    }
  }

  const deleteUser = async (username: string) => {
    setUsers(users.filter((user) => user.username !== username))
  }

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        uploadToKeycloak,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
