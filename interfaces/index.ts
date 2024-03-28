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

export interface ClientSession {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  not_before_policy: number
  scope: string
}
