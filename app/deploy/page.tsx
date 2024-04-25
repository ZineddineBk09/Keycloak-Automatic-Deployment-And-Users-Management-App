'use client'

import { KeycloakConfigurationContextProvider } from '../../context/keycloak-config'
import ConfigPage from '../../components/keycloak'

export default function KeycloakDeployPage() {
  return (
    <KeycloakConfigurationContextProvider>
      <ConfigPage />
    </KeycloakConfigurationContextProvider>
  )
}
