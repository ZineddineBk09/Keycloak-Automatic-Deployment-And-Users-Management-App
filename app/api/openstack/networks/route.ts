import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../db'
import { getNetworks } from '../../../../lib/api/openstack'

// get request handler to retreive network info
export async function GET(request: NextRequest) {
  // get users from keycloak server
  try {
    // get xAuthToken from request headers
    const xAuthToken: string = request.headers.get('X-Auth-Token') as string
    const response = await getNetworks(
      'https://dash.cloud.cerist.dz:8774/v2.1',
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
