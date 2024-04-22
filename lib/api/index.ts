import { toast } from 'sonner'
import { User } from '../../interfaces'
import axios from '../axios'
import { jwtDecode } from 'jwt-decode'

export const getRecords = async (endpoint: string) => {
  const kcSession = getKcSession()
  const { realm, admin } = await getClientRealmAndAdmin()

  if (!kcSession || !realm || !admin) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  // get users from keycloak server
  try {
    const response = await axios.get(`/${admin}/realms/${realm}/${endpoint}`, {
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

  if (!kcSession || !realm || !admin) {
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

export const deleteRecord = async (endpoint: string, id: string) => {
  const kcSession = getKcSession()
  const { realm, admin } = await getClientRealmAndAdmin()

  if (!kcSession || !realm || !admin) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  try {
    const response = await axios.delete(
      `/${admin}/realms/${realm}/${endpoint}/${id}`,
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

export const updateRecord = async (
  endpoint: string,
  user: any,
  userId: string
) => {
  const kcSession = getKcSession()
  const { realm, admin } = await getClientRealmAndAdmin()

  if (!kcSession || !realm || !admin) {
    throw new Error(
      'Please check if the Keycloak server is running. and try again.'
    )
  }

  try {
    const response = await axios.put(
      `/${admin}/realms/${realm}/${endpoint}/${userId}`,
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

export const getClientDomainRealmAndProtocol = async () => {
  const kcSession = getKcSession()
  const decoded = jwtDecode(kcSession) as any

  // send a request to get the client and return it's serverUrl, /api/client?clientId=${clientId}
  try {
    const response = await getClient(decoded.client_id)
    const { data } = response
    return {
      domain: data?.client?.serverUrl,
      realm: data?.client?.realmId,
      protocol: data?.client?.authProtocol,
    }
  } catch (error) {
    throw error
  }
}

const getKcSession = () => {
  const cookies = document.cookie
  return cookies
    .split(';')
    .find((cookie) => cookie.includes('kc_session'))
    ?.split('=')[1] as string
}
