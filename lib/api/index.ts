import axios from '../axios'

export const getAccessToken = async () => {
  // get client access token from keycloak server
  try {
    const url = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`

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

export const getUsers = async (accessToken: string) => {
  // get users from keycloak server
  try {
    const response = await axios.get('/admin/realms/master/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    throw error
  }
}

export const createUser = async (user: any, endpoint: string) => {
  try {
    const response = await axios.post(endpoint + '/', user)
    const data = await response.data
    return data
  } catch (error: any) {
    throw error
  }
}

export const deleteUser = async (userId: string, accessToken: string) => {
  try {
    const response = await axios.delete(
      `/admin/realms/master/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    const data = await response.data
    return data
  } catch (error: any) {
    throw error
  }
}

export const updateUser = async (
  user: any,
  userId: string,
  accessToken: string
) => {
  try {
    const response = await axios.put(
      `/admin/realms/master/users/${userId}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    const data = await response.data
    return data
  } catch (error: any) {
    throw error
  }
}
