import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../db'

export async function POST(request: NextRequest) {
  // get users from keycloak server
  try {
    // get username, project, password, and domain from request body
    const body = await request.json()
    console.log('request body:', body)
    const allowedFields = ['realmName', 'username', 'password', 'userId']

    // check if the request body contains the required fields
    for (const field of allowedFields) {
      if (!body[field]) {
        console.log('Missing required field:', field)
        return NextResponse.json(
          {
            status: 400,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        )
      }
    }

    try {
      const record = await prisma.openstackKeycloak.update({
        where: {
          userId: body?.userId,
        },
        data: {
          realmName: body?.realmName,
          adminUsername: body?.username,
          adminPassword: body?.password,
        },
      })

      console.log('updated openstackKeycloak object:', record)

      return NextResponse.json(
        {
          status: 200,
          data: {
            message: 'Keycloak config updated successfully!',
          },
        },
        { status: 200 }
      )
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        {
          status: 500,
          data: {
            message: 'error updating openstackKeycloak object',
          },
        },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: 'Error updating keycloak config',
      },
      { status: 500 }
    )
  }
}
