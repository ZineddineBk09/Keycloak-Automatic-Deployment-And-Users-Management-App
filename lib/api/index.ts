import { toast } from 'sonner'
import { User } from '../../interfaces'
import axios from '../axios'
import { jwtDecode } from 'jwt-decode'

export const getAccessToken = async () => {
  // get client access token from keycloak server
  try {
    const url =
      'http://localhost:8080/realms/master/protocol/openid-connect/token'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || '',
        client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || '',
      }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export const getUsers = async () => {
  const kcSession = getKcSession()
  const { realm, admin } = await getClientRealmAndAdmin()

  if (!kcSession) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  if (!realm || !admin) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  // get users from keycloak server
  try {
    const response = await axios.get(`/${admin}/realms/${realm}/users`, {
      headers: {
        Authorization: `Bearer ${kcSession}`,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    throw error
  }
}

export const createUser = async (user: User) => {
  const kcSession = getKcSession()
  const { realm, admin } = await getClientRealmAndAdmin()

  if (!kcSession) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  if (!realm || !admin) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  try {
    const response = await axios.post(`/${admin}/realms/${realm}/users`, user, {
      headers: {
        Authorization: `Bearer ${kcSession}`,
      },
    })
    const data = await response.data

    if (response.status === 201) {
      toast.success(`User ${user.username} created`)
    }
    return data
  } catch (error: any) {
    toast.error(`Failed to create user ${user.username}`)
    throw error
  }
}

export const deleteUser = async (userId: string) => {
  const kcSession = getKcSession()
  const { realm, admin } = await getClientRealmAndAdmin()

  if (!kcSession) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  if (!realm || !admin) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  try {
    const response = await axios.delete(
      `/${admin}/realms/${realm}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${kcSession}`,
        },
      }
    )
    const data = await response.data
    return data
  } catch (error: any) {
    throw error
  }
}

export const updateUser = async (user: any, userId: string) => {
  const kcSession = getKcSession()
  const { realm, admin } = await getClientRealmAndAdmin()

  if (!kcSession) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  if (!realm || !admin) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  try {
    const response = await axios.put(
      `/admin/realms/master/users/${userId}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${kcSession}`,
        },
      }
    )
    const data = await response.data
    return data
  } catch (error: any) {
    throw error
  }
}

export const getClient = async (clientId: string) => {
  const response = await fetch(`/api/client?clientId=${clientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  return data
}

const getClientRealmAndAdmin = async () => {
  const kcSession = getKcSession()
  const decoded = jwtDecode(kcSession) as any

  // send a request to get the client and return it's realm, /api/client?clientId=${clientId}
  try {
    const response = await getClient(decoded.client_id)
    const { data } = response
    return {
      realm: data?.client?.realmId,
      admin: data?.client?.adminUser,
    }
  } catch (error) {
    throw error
  }
}

export const getKcSession = () => {
  const cookies = document.cookie
  return cookies
    .split(';')
    .find((cookie) => cookie.includes('kc_session'))
    ?.split('=')[1] as string
}
