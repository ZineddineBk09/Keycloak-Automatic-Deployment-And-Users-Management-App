const flavorsEndpoint = 'flavors/detail'
const flavorsEndpointWithId = (id: string) => `flavors/${id}`
const keypairsEndpoint = 'os-keypairs'
const keypairsEndpointWithId = (id: string) => `os-keypairs/${id}`
const networksEndpoint = 'os-networks'
const networksEndpointWithId = (id: string) => `os-networks/${id}`
const securityGroupsEndpoint = ':9696/v2.0/security-groups'
const securityGroupRulesEndpoint = ':9696/v2.0/security-group-rules'
const authEndpoint = ':5000/v3/auth/tokens?nocatalog'
const stackEndpoint = (tenantId: string) => `:8004/v1/${tenantId}/stacks`

const endpoints = {
  flavorsEndpoint,
  flavorsEndpointWithId,
  keypairsEndpoint,
  keypairsEndpointWithId,
  networksEndpoint,
  networksEndpointWithId,
  securityGroupsEndpoint,
  securityGroupRulesEndpoint,
  authEndpoint,
  stackEndpoint,
}

export default endpoints
