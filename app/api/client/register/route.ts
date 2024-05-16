import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../db'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { deleteClient } from '../../../../utils/prisma'

// define the zod schema for the request body
const schema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  realmId: z.string().min(1),
  authProtocol: z.string().min(1),
  adminUser: z.string().min(1),
  serverUrl: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const req = await request.json()
  // check if the request body is valid
  const result = schema.safeParse(req)

  // if the request body is not valid, contains more than 6 keys or the schema validation fails
  if (Object.keys(req).length !== 6 || !result.success) {
    console.log('invalid request body')
    return NextResponse.json(
      {
        status: 400,
        data: {
          message: 'invalid request body',
        },
      },
      { status: 400 }
    )
  }

  const {
    clientId,
    clientSecret,
    realmId,
    authProtocol,
    adminUser,
    serverUrl,
  } = req

  // check if the client exist in the database
  let client = await prisma.client.findUnique({
    where: {
      clientId,
    },
  })

  // if the client exist
  if (client) {
    console.log('client exist')
    return NextResponse.json(
      {
        status: 409,
        data: {
          message: 'client exist',
        },
      },
      { status: 409 }
    )
  }

  try {
    client = await prisma.client.create({
      data: {
        clientId,
        clientSecret: await bcrypt.hash(clientSecret, 10),
        realmId,
        authProtocol,
        adminUser,
        serverUrl,
      },
    })
  } catch (err) {
    console.log('error creating client', err)

    return NextResponse.json(
      {
        status: 500,
        data: {
          message: 'error creating client',
        },
      },
      { status: 500 }
    )
  }

  // if the client exist and the clientSecret is correct
  if (client && (await bcrypt.compare(clientSecret, client.clientSecret))) {
    // request an access token from the keycloak server
    try {
      const url: string = `${serverUrl}/realms/${realmId}/protocol/${authProtocol}/token`

      // request an access token from the keycloak server
      console.log('======================')
      console.log(url)
      console.log(url)
      const response = await fetch(url, {
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
      return NextResponse.json(
        {
          status: response.status,
          data: await response.json(),
        },
        {
          status: response.status,
        }
      )
    } catch (err) {
      console.log('error registering client', err)

      // delete the client from the database
      await deleteClient(clientId)

      return NextResponse.json(
        {
          status: 500,
          data: {
            message: 'error registering client',
          },
        },
        { status: 500 }
      )
    }
  } else {
    // return an error
    console.log('client secret is incorrect')
    return NextResponse.json(
      {
        status: 401,
        data: {
          message: 'client secret is incorrect',
        },
      },
      { status: 401 }
    )
  }
}
