export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  credentials: { type: string; value: string; temporary: boolean }[];
  groups: string[];
}

export interface KeycloakUser {
  id: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  disableableCredentialTypes: string[];
  requiredActions: string[];
  notBefore: number;
  access: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
}

export interface KeycloakClient {
  id: string;
  clientId: string;
  name: string;
  rootUrl: string;
  baseUrl: string;
  surrogateAuthRequired: boolean;
  enabled: boolean;
  alwaysDisplayInConsole: boolean;
  clientAuthenticatorType: string;
  redirectUris: string[];
  webOrigins: string[];
  notBefore: number;
  bearerOnly: boolean;
  consentRequired: boolean;
  standardFlowEnabled: boolean;
  implicitFlowEnabled: boolean;
  directAccessGrantsEnabled: boolean;
  serviceAccountsEnabled: boolean;
  publicClient: boolean;
  frontchannelLogout: boolean;
  protocol: string;
  attributes: { [key: string]: string };
  authenticationFlowBindingOverrides: { [key: string]: string };
  fullScopeAllowed: boolean;
  nodeReRegistrationTimeout: number;
  defaultClientScopes: string[];
  optionalClientScopes: string[];
  access: {
    view: boolean;
    configure: boolean;
    manage: boolean;
  };
}

export interface ClientSession {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  not_before_policy: number;
  scope: string;
}

export interface Response {
  status: number;
  data: any;
}

export interface Client {
  id: string;
  clientId: string;
  clientSecret: string;
  realmId: string;
  authProtocol: string;
  adminUser: string;
  serverUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface KeycloakGroup {
  id: string;
  name: string;
  path: string;
  subGroupCount: number;
}

export interface DecodedJWT {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: { roles: string[] };
  resource_access: { [key: string]: { roles: string[] } };
  scope: string;
  clientHost: string;
  email_verified: boolean;
  preferred_username: string;
  clientAddress: string;
  client_id: string;
}

export interface FieldType {
  id: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  options?: string[];
}

export interface Realm {
  id: string;
  realm: string;
  enabled: boolean;
  displayName?: string;
  accessTokenLifespan: number;
  sslRequired: "all" | "none" | "external";
  notBefore: number;
  defaultSignatureAlgorithm: string;
  revokeRefreshToken: boolean;
  refreshTokenMaxReuse: number;
  ssoSessionIdleTimeout: number;
  ssoSessionMaxLifespan: number;
  offlineSessionIdleTimeout: number;
  offlineSessionMaxLifespanEnabled: boolean;
  offlineSessionMaxLifespan: number;
  accessCodeLifespan: number;
  accessCodeLifespanUserAction: number;
  accessCodeLifespanLogin: number;
  actionTokenGeneratedByAdminLifespan: number;
  actionTokenGeneratedByUserLifespan: number;
  oauth2DeviceCodeLifespan: number;
  oauth2DevicePollingInterval: number;
  registrationAllowed: boolean;
  loginWithEmailAllowed: boolean;
  duplicateEmailsAllowed: boolean;
  resetPasswordAllowed: boolean;
  editUsernameAllowed: boolean;
  bruteForceProtected: boolean;
  permanentLockout: boolean;
  maxFailureWaitSeconds: number;
  minimumQuickLoginWaitSeconds: number;
  waitIncrementSeconds: number;
  failureFactor: number;
  defaultRole: {
    id: string;
    name: string;
    description: string;
    composite: boolean;
    clientRole: boolean;
    containerId: string;
  };
  requiredCredentials: string[];
  otpPolicyType: string;
  otpPolicyAlgorithm: string;
  otpPolicyDigits: number;
  otpPolicyPeriod: number;
  webAuthnPolicyRpEntityName: string;
  webAuthnPolicySignatureAlgorithms: string[];
  browserSecurityHeaders: {
    contentSecurityPolicy: string;
    xContentTypeOptions: string;
    referrerPolicy: string;
    xRobotsTag: string;
    xFrameOptions: string;
    xXSSProtection: string;
    strictTransportSecurity: string;
  };
  smtpServer: Record<string, any>;
  eventsEnabled: boolean;
  eventsListeners: string[];
  adminEventsEnabled: boolean;
  adminEventsDetailsEnabled: boolean;
  internationalizationEnabled: boolean;
  supportedLocales: string[];
  attributes: Record<string, string>;
  userManagedAccessAllowed: boolean;
}
