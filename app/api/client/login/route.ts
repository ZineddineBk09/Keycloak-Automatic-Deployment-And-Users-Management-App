import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../db'
import bcrypt from 'bcrypt'
// create a validator for the request body with zod
import { z } from 'zod'

// define the schema for the request body
const schema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  realmId: z.string().min(1),
  authProtocol: z.string().min(1),
  adminUser: z.string().min(1),
  serverUrl: z.string().min(1),
})

// handle the logic for the POST request where the client send hist clientId/clientSecret to get an access token form the keycloak server
// http://localhost:8080/realms/master/protocol/openid-connect/token

export async function POST(request: NextRequest) {
  const req = await request.json()

  // check if the request body is valid
  const result = schema.safeParse(req)

  // if the request body is not valid
  if (!result.success) {
    console.log('invalid request body')
    return NextResponse.error()
  }

  const { clientId, clientSecret, realmId } = req

  // check if the client exist in the database
  let client = await prisma.client.findUnique({
    where: {
      clientId,
    },
  })

  // if the client does not exist
  if (!client) {
    console.log('client does not exist')
    try {
      client = await prisma.client.create({
        data: {
          clientId,
          clientSecret: await bcrypt.hash(clientSecret, 10),
          realmId,
        },
      })
    } catch (err) {
      console.log('error creating client', err)
      return NextResponse.error()
    }
  }

  // if the client exist and the clientSecret is correct
  if (client && (await bcrypt.compare(clientSecret, client.clientSecret))) {
    // request an access token from the keycloak server
    const response = await fetch(process.env.KEYCLOAK_AUTH_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    })

    // return the response from the keycloak server
    return NextResponse.json(await response.json())
  } else {
    // return an error
    console.log('clientSecret is incorrect')
    return NextResponse.error()
  }
}
