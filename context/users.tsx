import { createContext, useContext, useEffect, useState } from 'react'
import { KeycloakUser } from '../interfaces'
import { toast } from 'sonner'
import { getRecords, deleteRecord, getUsersCount } from '../lib/api/keycloak'
import { useCookies } from 'react-cookie'

export const UsersContext = createContext({})

export const useUsersContext: {
  (): {
    users: KeycloakUser[]
    setUsers: React.Dispatch<React.SetStateAction<KeycloakUser[]>>
    fetchUsers: () => Promise<void>
    deleteUsers: (ids: string[]) => Promise<void>
    page: number, totalPages: number,
    nextPage: () => Promise<void>
    previousPage: () => Promise<void>
  }
} = () => useContext(UsersContext as React.Context<any>)

export const UsersContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [users, setUsers] = useState<KeycloakUser[]>([] as KeycloakUser[])
  const [cookies] = useCookies(['kc_session'])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 100;

  const fetchUsers = async () => {
    // call the create user API
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          'You need to login first to fetch users. Please login and try again.'
        )
      }

      const response = await getRecords('users', (page - 1) * pageSize, pageSize);
      setUsers(
        [
          ...response
        ]
      )
      setTotalPages(Math.ceil(response.total / pageSize)); // Assuming `response.total` gives the total count of users
    } catch (error: any) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  const nextPage = async () => {
    setPage(Math.min(page + 1, totalPages));
    await fetchUsers();
  }

  const previousPage = async () => {
    setPage(Math.max(page - 1, 1));
    await fetchUsers();
  }

  const deleteUsers = async (ids: string[]) => {
    try {
      if (!cookies?.kc_session)
        throw new Error(
          'You need to login first to delete users. Please login and try again.'
        )

      await Promise.all(ids.map((id) => deleteRecord('users', id)))
      await fetchUsers()
    } catch (error: any) {
      console.error('Error deleting users:', error)
      throw error
    }
  }

  useEffect(() => {
    if (!cookies?.kc_session) return
    fetchUsers()
      .then(() => {
        toast.success('Users fetched')
      })
      .catch((error) => {
        toast.error(error.message)
      })
    getUsersCount().then(data => console.log('COUNT: ', data))
  }, [cookies?.kc_session])

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        fetchUsers,
        deleteUsers,
        page,
        totalPages,
        nextPage,
        previousPage
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
