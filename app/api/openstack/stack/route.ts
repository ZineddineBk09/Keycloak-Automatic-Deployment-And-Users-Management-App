import { NextResponse, NextRequest } from 'next/server'
import { getFlavors } from '../../../../lib/api/openstack'

// get request handler to retreive flavor info
export async function GET(request: NextRequest) {
  // get users from keycloak server
  try {
    const response = await getFlavors('https://dash.cloud.cerist.dz:8774/v2.1')

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
