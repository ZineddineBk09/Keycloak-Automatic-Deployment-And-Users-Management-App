export interface Flavor {
  id: string
  name: string
  vcpus: number
  ram: number
  disk: number
}

export interface Image {
  id: string
  name: string
  status: string
  minRam: number
  minDisk: number
}

export interface Keypair {
  keypair: { name: string; public_key: string }
}

export interface Network {
  id: string
  label: string
}

export interface SecurityGroup {
  id: string
  name: string
  description: string
  rules: {
    id: string
    ip_protocol: string
    from_port: number
    to_port: number
  }[]
}

export interface OpenstackConfig {
  adminPassword: string
  adminUsername: string
  baseUrl: string
  createdAt: string
  domain: string
  flavor: string
  id: string
  keycloakPort: string
  keypair: string
  network: string
  project: string
  realmName: string
  securityGroup: string
  tenantId: string
  stackId: string
  updatedAt: string
  userId: string
  username: string
}
