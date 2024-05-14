import endpoints from '../../utils/endpoints'
import axios from '../axios/openstack'

const getRecords = async (
  url: string,
  endpoint: string,
  xAuthToken: string
) => {
  if (!url || !endpoint || !xAuthToken) {
    throw new Error(
      'url, endpoint and xAuthToken are required to get records from keycloak server'
    )
  }

  // get users from keycloak server
  try {
    const response = await axios.get(`${url}/${endpoint}`, {
      headers: {
        'X-Auth-Token': xAuthToken,
      },
    })
    const data = await response.data
    return data
  } catch (error) {
    throw error
  }
}

export const getFlavors = async (url: string, xAuthToken: string) => {
  return await getRecords(url, endpoints.flavorsEndpoint, xAuthToken)
    ?.then((data) => {
      return data?.flavors || []
    })
    .catch((error) => {
      throw error
    })
}

export const getServers = async (url: string, xAuthToken: string) => {
  return await getRecords(url, endpoints.serversEndpoint, xAuthToken)
    ?.then((data) => {
      return data?.servers || []
    })
    .catch((error) => {
      throw error
    })
}

export const getKeypairs = async (url: string, xAuthToken: string) => {
  return await getRecords(url, endpoints.keypairsEndpoint, xAuthToken)
    ?.then((data) => {
      return data?.keypairs || []
    })
    .catch((error) => {
      throw error
    })
}

export const getNetworks = async (url: string, xAuthToken: string) => {
  return await getRecords(url, endpoints.networksEndpoint, xAuthToken)
    ?.then((data) => {
      return data?.networks || []
    })
    .catch((error) => {
      throw error
    })
}

export const getOpenstackAuthToken = () => {
  const cookies = document.cookie
  return cookies
    .split(';')
    .find((cookie) => cookie.includes('openstack_auth_token'))
    ?.split('=')[1] as string
}

// =========================================================

const createRecord = async (
  url: string,
  endpoint: string,
  xAuthToken: string,
  data: any
) => {
  if (!url || !endpoint || !xAuthToken) {
    throw new Error(
      'url, endpoint and xAuthToken are required to create record in keycloak server'
    )
  }

  // get users from keycloak server
  try {
    const response = await axios.post(`${url + endpoint}`, data, {
      headers: {
        'X-Auth-Token': xAuthToken,
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const createSecurityGroup = async (
  url: string,
  xAuthToken: string,
  data: any
) => {
  return await createRecord(
    url,
    endpoints.securityGroupsEndpoint,
    xAuthToken,
    data
  )
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw error
    })
}

export const createSecurityGroupRule = async (
  url: string,
  xAuthToken: string,
  data: any
) => {
  return await createRecord(
    url,
    endpoints.securityGroupRulesEndpoint,
    xAuthToken,
    data
  )
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw error
    })
}

export const createStack = async (
  url: string,
  xAuthToken: string,
  data: any
) => {
  return await createRecord(
    url,
    endpoints.stackEndpoint(data?.tenantId),
    xAuthToken,
    data
  )
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw error
    })
}
