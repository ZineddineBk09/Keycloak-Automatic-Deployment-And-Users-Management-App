export interface User {
  username: string
  firstName: string
  lastName: string
  email: string
  emailVerified: boolean
  enabled: boolean
  credentials: { type: string; value: string; temporary: boolean }[]
  groups: string[]
}

export interface KeycloakUser {
  id: string
  createdTimestamp: number
  username: string
  enabled: boolean
  totp: boolean
  emailVerified: boolean
  firstName: string
  lastName: string
  email: string
  disableableCredentialTypes: string[]
  requiredActions: string[]
  notBefore: number
  access: {
    manageGroupMembership: boolean
    view: boolean
    mapRoles: boolean
    impersonate: boolean
    manage: boolean
  }
}

export interface KeycloakClient {
  id: string
  clientId: string
  name: string
  rootUrl: string
  baseUrl: string
  surrogateAuthRequired: boolean
  enabled: boolean
  alwaysDisplayInConsole: boolean
  clientAuthenticatorType: string
  redirectUris: string[]
  webOrigins: string[]
  notBefore: number
  bearerOnly: boolean
  consentRequired: boolean
  standardFlowEnabled: boolean
  implicitFlowEnabled: boolean
  directAccessGrantsEnabled: boolean
  serviceAccountsEnabled: boolean
  publicClient: boolean
  frontchannelLogout: boolean
  protocol: string
  attributes: { [key: string]: string }
  authenticationFlowBindingOverrides: { [key: string]: string }
  fullScopeAllowed: boolean
  nodeReRegistrationTimeout: number
  defaultClientScopes: string[]
  optionalClientScopes: string[]
  access: {
    view: boolean
    configure: boolean
    manage: boolean
  }
}

export interface ClientSession {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  not_before_policy: number
  scope: string
}

export interface Response {
  status: number
  data: any
}

export interface Client {
  id: string
  clientId: string
  clientSecret: string
  realmId: string
  authProtocol: string
  adminUser: string
  serverUrl: string
  createdAt: string
  updatedAt: string
}

export interface DecodedJWT {
  exp: number
  iat: number
  jti: string
  iss: string
  aud: string[]
  sub: string
  typ: string
  azp: string
  acr: string
  'allowed-origins': string[]
  realm_access: { roles: string[] }
  resource_access: { [key: string]: { roles: string[] } }
  scope: string
  clientHost: string
  email_verified: boolean
  preferred_username: string
  clientAddress: string
  client_id: string
}
