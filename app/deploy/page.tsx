'use client'

import { KeycloakConfigurationContextProvider } from '../../context/keycloak-config'
import ConfigPage from '../../components/deploy'

export default function KeycloakDeployPage() {
  return (
    <KeycloakConfigurationContextProvider>
      <ConfigPage />
    </KeycloakConfigurationContextProvider>
  )
}
