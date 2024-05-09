const flavorsEndpoint = 'flavors/detail'
const flavorsEndpointWithId = (id: string) => `flavors/${id}`
const imagesEndpoint = 'images'
const imagesEndpointWithId = (id: string) => `images/${id}`
const keypairsEndpoint = 'os-keypairs'
const keypairsEndpointWithId = (id: string) => `os-keypairs/${id}`
const networksEndpoint = 'os-networks'
const networksEndpointWithId = (id: string) => `os-networks/${id}`
const securityGroupsEndpoint = 'os-security-groups'
const securityGroupsEndpointWithId = (id: string) => `os-security-groups/${id}`
const authEndpoint = 'v3/auth/tokens?nocatalog'

const endpoints = {
  flavorsEndpoint,
  flavorsEndpointWithId,
  imagesEndpoint,
  imagesEndpointWithId,
  keypairsEndpoint,
  keypairsEndpointWithId,
  networksEndpoint,
  networksEndpointWithId,
  securityGroupsEndpoint,
  securityGroupsEndpointWithId,
  authEndpoint,
}

export default endpoints
