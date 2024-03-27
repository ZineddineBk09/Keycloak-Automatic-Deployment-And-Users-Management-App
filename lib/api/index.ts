import axios from '../axios'

export const getAccessToken = async () => {
  // get client access token from keycloak server
  try {
    const url = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`

    const response = await fetch(
      'http://192.168.1.37:8080/realms/master/protocol/openid-connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || '',
          client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || '',
        }),
      }
    )
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

export const updateRecord = async (record: any, endpoint: string) => {
  try {
    const response = await axios.put(endpoint + '/' + record.id + '/', record)
    const data = await response.data
    return data
  } catch (error) {
    throw error
  }
}

export const partialUpdateRecord = async (record: any, endpoint: string) => {
  try {
    const response = await axios.patch(endpoint + '/' + record.id + '/', record)
    const data = await response.data
    return data
  } catch (error) {
    throw error
  }
}

export const deleteRecord = async (id: string | number, endpoint: string) => {
  try {
    const response = await axios.delete(endpoint + '/' + id + '/')
    const data = await response.data
    return data
  } catch (error) {
    throw error
  }
}

export const getRecords = async (endpoint: string) => {
  try {
    const response = await axios.get(endpoint + '/')
    const data = await response.data
    return data
  } catch (error) {
    return []
  }
}

export const getRecord = async (id: string, endpoint: string) => {
  try {
    const response = await axios.get(endpoint + '/' + id + '/')
    const data = await response.data
    return data
  } catch (error) {
    return {}
  }
}

export const filterRecords = async (params: any, endpoint: string) => {
  try {
    const response = await axios.get(endpoint + '/', {
      params,
    })
    const data = await response.data
    return data
  } catch (error) {
    return []
  }
}

export const searchRecords = async (search: string, endpoint: string) => {
  try {
    const response = await axios.get(endpoint + '/', {
      params: { search },
    })
    const data = await response.data
    return data
  } catch (error) {
    return []
  }
}
