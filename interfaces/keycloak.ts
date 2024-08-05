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

export interface Group {
  name: string
  path: string
}

export interface KeycloakGroup extends Group {
  /** {
    "id": "3ebd0887-464e-472a-ab34-76c49ef2c108",
    "name": "Group",
    "path": "/Group",
    "subGroupCount": 0,
    "subGroups": [],
    "access": {
      "view": true,
      "viewMembers": true,
      "manageMembers": true,
      "manage": true,
      "manageMembership": true
    }
  } */
  id: string
  name: string
}

interface Role {
  id: string
  name: string
  description: string
  composite: boolean
  composites?: Record<string, string[]>
  clientRole: boolean
  containerId: string
  attributes: Record<string, unknown | string>
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
  realmRoles: string[]
  groups: string[]
  clientRoles: Record<string, string[]>
  serviceAccountClientId: string
  credentials: {
    id: string
    type: string
    createdDate: number
    secretData: {
      value: string
      salt: string
      additionalParameters: Record<string, unknown>
    }
    credentialData: {
      hashIterations: number
      algorithm: string
      additionalParameters: Record<string, unknown>
    }
  }[]
}

export interface Client {
  clientId: string
  name: string
  protocol: string
  enabled: boolean
}

export interface KeycloakClient extends Client {
  id: string
  rootUrl: string
  baseUrl: string
  surrogateAuthRequired: boolean
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
  attributes: Record<string, string>
  authenticationFlowBindingOverrides: Record<string, string>
  fullScopeAllowed: boolean
  nodeReRegistrationTimeout: number
  defaultClientScopes: string[]
  optionalClientScopes: string[]
}

export interface KeycloakScopeMapping {
  clientScope: string
  roles: string[]
}

export interface KeycloakClientScopeMapping {
  [client: string]: {
    roles: string[]
  }
}

export interface KeycloakClientScope {
  id: string
  name: string
  description: string
  protocol: string
  attributes: Record<string, string>
  protocolMappers: {
    id: string
    name: string
    protocol: string
    protocolMapper: string
    consentRequired: boolean
    config: Record<string, string>
  }[]
}

export interface KeycloakComponents {
  'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy': {
    id: string
    name: string
    providerId: string
    subType: string
    subComponents: Record<string, unknown>
    config: Record<string, string[]>
  }[]
  'org.keycloak.userprofile.UserProfileProvider': {
    id: string
    providerId: string
    subComponents: Record<string, unknown>
    config: Record<string, string[]>
  }[]
  'org.keycloak.keys.KeyProvider': {
    id: string
    name: string
    providerId: string
    subComponents: Record<string, unknown>
    config: Record<string, string[]>
  }[]
}

export interface KeycloakRequiredAction {
  alias: string
  name: string
  providerId: string
  enabled: boolean
  defaultAction: boolean
  priority: number
  config: Record<string, string>
}

export interface KeycloakAuthenticatorConfig {
  id: string
  alias: string
  config: Record<string, string>
}

export interface KeycloakAuthenticationFlow {
  id: string
  alias: string
  description: string
  providerId: string
  topLevel: boolean
  builtIn: boolean
  authenticationExecutions: {
    authenticator: string
    authenticatorFlow: boolean
    requirement: string
    priority: number
    flowAlias?: string
    userSetupAllowed: boolean
  }[]
}

export interface KeycloakConfig {
  id: string
  realm: string
  displayName: string
  displayNameHtml: string
  notBefore: number
  defaultSignatureAlgorithm: string
  revokeRefreshToken: boolean
  refreshTokenMaxReuse: number
  accessTokenLifespan: number
  accessTokenLifespanForImplicitFlow: number
  ssoSessionIdleTimeout: number
  ssoSessionMaxLifespan: number
  ssoSessionIdleTimeoutRememberMe: number
  ssoSessionMaxLifespanRememberMe: number
  offlineSessionIdleTimeout: number
  offlineSessionMaxLifespanEnabled: boolean
  offlineSessionMaxLifespan: number
  clientSessionIdleTimeout: number
  clientSessionMaxLifespan: number
  clientOfflineSessionIdleTimeout: number
  clientOfflineSessionMaxLifespan: number
  accessCodeLifespan: number
  accessCodeLifespanUserAction: number
  accessCodeLifespanLogin: number
  actionTokenGeneratedByAdminLifespan: number
  actionTokenGeneratedByUserLifespan: number
  oauth2DeviceCodeLifespan: number
  oauth2DevicePollingInterval: number
  enabled: boolean
  sslRequired: string
  registrationAllowed: boolean
  registrationEmailAsUsername: boolean
  rememberMe: boolean
  verifyEmail: boolean
  loginWithEmailAllowed: boolean
  duplicateEmailsAllowed: boolean
  resetPasswordAllowed: boolean
  editUsernameAllowed: boolean
  bruteForceProtected: boolean
  permanentLockout: boolean
  maxTemporaryLockouts: number
  maxFailureWaitSeconds: number
  minimumQuickLoginWaitSeconds: number
  waitIncrementSeconds: number
  quickLoginCheckMilliSeconds: number
  maxDeltaTimeSeconds: number
  failureFactor: number
  roles: {
    realm: Role[]
    client: Record<string, Role[]>
  }
  // groups: KeycloakGroup[]
  defaultRole: Role
  requiredCredentials: string[]
  otpPolicyType: string
  otpPolicyAlgorithm: string
  otpPolicyInitialCounter: number
  otpPolicyDigits: number
  otpPolicyLookAheadWindow: number
  otpPolicyPeriod: number
  otpPolicyCodeReusable: boolean
  otpSupportedApplications: string[]
  localizationTexts: Record<string, string>
  webAuthnPolicyRpEntityName: string
  webAuthnPolicySignatureAlgorithms: string[]
  webAuthnPolicyRpId: string
  webAuthnPolicyAttestationConveyancePreference: string
  webAuthnPolicyAuthenticatorAttachment: string
  webAuthnPolicyRequireResidentKey: string
  webAuthnPolicyUserVerificationRequirement: string
  webAuthnPolicyCreateTimeout: number
  webAuthnPolicyAvoidSameAuthenticatorRegister: boolean
  webAuthnPolicyAcceptableAaguids: string[]
  webAuthnPolicyExtraOrigins: string[]
  webAuthnPolicyPasswordlessRpEntityName: string
  webAuthnPolicyPasswordlessSignatureAlgorithms: string[]
  webAuthnPolicyPasswordlessRpId: string
  webAuthnPolicyPasswordlessAttestationConveyancePreference: string
  webAuthnPolicyPasswordlessAuthenticatorAttachment: string
  webAuthnPolicyPasswordlessRequireResidentKey: string
  webAuthnPolicyPasswordlessUserVerificationRequirement: string
  webAuthnPolicyPasswordlessCreateTimeout: number
  webAuthnPolicyPasswordlessAvoidSameAuthenticatorRegister: boolean
  webAuthnPolicyPasswordlessAcceptableAaguids: string[]
  webAuthnPolicyPasswordlessExtraOrigins: string[]
  // users: KeycloakUser[]
  scopeMappings: KeycloakScopeMapping[]
  clientScopeMappings: KeycloakClientScopeMapping
  clients: KeycloakClient[]
  clientScopes: KeycloakClientScope[]
  defaultDefaultClientScopes: string[]
  defaultOptionalClientScopes: string[]
  browserSecurityHeaders: Record<string, string>
  smtpServer: Record<string, unknown>
  eventsEnabled: boolean
  eventsListeners: string[]
  enabledEventTypes: string[]
  adminEventsEnabled: boolean
  adminEventsDetailsEnabled: boolean
  identityProviders: Record<string, unknown>
  identityProviderMappers: Record<string, unknown>
  components: KeycloakComponents
  internationalizationEnabled: boolean
  supportedLocales: string[]
  authenticationFlows: KeycloakAuthenticationFlow[]
  authenticatorConfig: KeycloakAuthenticatorConfig[]
  requiredActions: KeycloakRequiredAction[]
  browserFlow: string
  registrationFlow: string
  directGrantFlow: string
  resetCredentialsFlow: string
  clientAuthenticationFlow: string
  dockerAuthenticationFlow: string
  firstBrokerLoginFlow: string
  attributes: {
    cibaBackchannelTokenDeliveryMode: string
    cibaAuthRequestedUserHint: string
    oauth2DevicePollingInterval: string
    clientOfflineSessionMaxLifespan: string
    clientSessionIdleTimeout: string
    actionTokenGeneratedByUserLifespan_verify_email: string
    actionTokenGeneratedByUserLifespan_idp_verify_account_via_email: string
    clientOfflineSessionIdleTimeout: string
    actionTokenGeneratedByUserLifespan_execute_actions: string
    cibaInterval: string
    realmReusableOtpCode: string
    cibaExpiresIn: string
    oauth2DeviceCodeLifespan: string
    parRequestUriLifespan: string
    clientSessionMaxLifespan: string
    shortVerificationUri: string
    actionTokenGeneratedByUserLifespan_reset_credentials: string
    keycloakVersion: string
    userManagedAccessAllowed: boolean
    clientProfiles: Record<string, unknown>
    clientPolicies: Record<string, unknown>
  }
}
