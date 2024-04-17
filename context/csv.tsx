import { createContext, useContext, useState } from 'react'
import { User } from '../interfaces'
import { useRouter } from 'next/navigation'
import { createUser } from '../lib/api'

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
  const router = useRouter()

  const uploadToKeycloak = async () => {
    try {
      const createdUsers = await Promise.all(
        users.map(async (user) => {
          return await createUser(user)
        })
      )
      setUsers([])
      router.push('/users')
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
