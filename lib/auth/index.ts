// signin keycloak
export const signIn = async (credentials: any, options?: any) => {
  // check if credentials contains clientId, and clientSecret
  if (!credentials.clientId || !credentials.clientSecret) {
    throw new Error('Client ID and Client Secret are required')
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_CLIENT_AUTH_URL || '',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
        }),
      }
    )

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

// signout keycloak
export const signOut = async (accessToken: string) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_CLIENT_LOGOUT_URL || '',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // content type should be application/x-www-form-urlencoded
        },
      }
    )

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}
