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
