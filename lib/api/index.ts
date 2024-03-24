import { getSession } from 'next-auth/react'
import axios from '../axios'

export const createRecord = async (record: any, endpoint: string) => {
  const session: any = await getSession()

  try {
    const response = await axios.post(endpoint + '/', record, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    const data = await response.data
    return data
  } catch (error: any) {
    console.log('Error creating record', error)
    throw error
  }
}

export const updateRecord = async (record: any, endpoint: string) => {
  const session: any = await getSession()

  try {
    const response = await axios.put(endpoint + '/' + record.id + '/', record, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    console.log('Error updating record', error)
    throw error
  }
}

export const partialUpdateRecord = async (record: any, endpoint: string) => {
  const session: any = await getSession()

  try {
    const response = await axios.patch(
      endpoint + '/' + record.id + '/',
      record,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )
    const data = await response.data
    return data
  } catch (error) {
    console.log('Error updating record', error)
    throw error
  }
}

export const deleteRecord = async (id: string | number, endpoint: string) => {
  const session: any = await getSession()
  try {
    const response = await axios.delete(endpoint + '/' + id + '/', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    console.log('Error deleting record', error)
    throw error
  }
}

export const getRecords = async (endpoint: string) => {
  const session: any = await getSession()

  try {
    const response = await axios.get(endpoint + '/', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    console.log('Error retreiving records', error)
    return []
  }
}

export const getRecord = async (id: string, endpoint: string) => {
  const session: any = await getSession()

  try {
    const response = await axios.get(endpoint + '/' + id + '/', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    console.log('Error retreiving record', error)
    return {}
  }
}

export const filterRecords = async (params: any, endpoint: string) => {
  const session: any = await getSession()

  try {
    const response = await axios.get(endpoint + '/', {
      params,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    console.log('Error filtering records', error)
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
    console.log('Error searching records', error)
    return []
  }
}
