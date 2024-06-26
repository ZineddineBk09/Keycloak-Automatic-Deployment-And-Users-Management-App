import { NextResponse, NextRequest } from 'next/server'
import { getServers } from '../../../../lib/api/openstack'
import { prisma } from '../../../../db'

// get request handler to retreive flavor info
export async function GET(request: NextRequest) {
  // get users from keycloak server
  try {
    // get xAuthToken from request headers
    const xAuthToken: string = request.headers.get('X-Auth-Token') as string
    const userId: string = request.headers.get('userId') as string

    if (
      !userId ||
      !xAuthToken ||
      xAuthToken === 'undefined' ||
      userId === 'undefined'
    ) {
      return NextResponse.json(
        {
          status: 400,
          message: 'userId and xAuthToken are required',
        },
        { status: 400 }
      )
    }

    // get the openstack config from db to retreive the url
    const openstackConfig = await prisma.openstackKeycloak.findUnique({
      where: {
        userId: userId,
      },
    })

    const response = await getServers(
      `${openstackConfig?.baseUrl}:8774/v2.1`,
      xAuthToken
    )

    return NextResponse.json(
      {
        status: 200,
        data: response,
      },
      { status: 200 }
    )
  } catch (error) {
    throw error
  }
}
