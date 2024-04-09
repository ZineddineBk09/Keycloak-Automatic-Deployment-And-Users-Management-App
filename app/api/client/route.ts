import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../db'

// get request handler to retreive client info: /client/:clientId
export async function GET(request: NextRequest) {
  const clientId: string = request.nextUrl.searchParams.get(
    'clientId'
  ) as string

  // get client info from the database
  let client = await prisma.client.findUnique({
    where: {
      clientId,
    },
  })

  // if the client does not exist
  if (!client) {
    console.log('client does not exist')
    return NextResponse.json(
      {
        status: 404,
        data: {
          message: 'client does not exist',
        },
      },
      { status: 404 }
    )
  }

  return NextResponse.json(
    {
      status: 200,
      data: {
        message: 'client found',
        client,
      },
    },
    { status: 200 }
  )
}

// patch request handler to update client info: /client/:clientId
export async function PATCH(request: NextRequest) {
  const clientId: string = request.nextUrl.searchParams.get(
    'clientId'
  ) as string
  const body = await request.json()

  const allowedFields = [
    'clientId',
    'realmId',
    'authProtocol',
    'adminUser',
    'serverUrl',
  ]

  // check if the body contains any invalid fields
  for (const field in body) {
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        {
          status: 400,
          data: {
            message: 'invalid field: ' + field,
          },
        },
        { status: 400 }
      )
    }
  }

  // update client info in the database
  let client = await prisma.client.update({
    where: {
      clientId,
    },
    data: {
      ...body,
    },
  })

  return NextResponse.json(
    {
      status: 200,
      data: {
        message: 'client updated',
        client,
      },
    },
    { status: 200 }
  )
}
