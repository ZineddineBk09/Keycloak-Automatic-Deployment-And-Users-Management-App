import { NextResponse, NextRequest } from 'next/server'
import { getKeypairs } from '../../../../lib/api/openstack'
import { prisma } from '../../../../db'

// get request handler to retreive keypair info
export async function GET(request: NextRequest) {
  // get users from keycloak server
  try {
    // get xAuthToken from request headers
    const xAuthToken: string = request.headers.get('X-Auth-Token') as string
    const userId: string = request.headers.get('userId') as string

    // get the openstack config from db to retreive the url
    const openstackConfig = await prisma.openstackKeycloak.findUnique({
      where: {
        userId: userId,
      },
    })

    const response = await getKeypairs(
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
