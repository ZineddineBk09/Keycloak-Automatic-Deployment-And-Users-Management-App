import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../db'

// get request handler to retreive image info
export async function GET(request: NextRequest) {
  // get users from keycloak server
  try {
    // get userId from request headers
    const userId: string = request.headers.get('userId') as string
    const openstackConfig = await prisma.openstackKeycloak.findUnique({
      where: {
        userId: userId,
      },
    })
    console.log('GET flavors', openstackConfig)
    return NextResponse.json(
      {
        status: 200,
        data: openstackConfig,
      },
      { status: 200 }
    )
  } catch (error) {
    throw error
  }
}


export async function PUT(request: NextRequest) {
  // get users from keycloak server
  try {
    // get userId from request headers
    const userId: string = request.headers.get('userId') as string
    const body = await request.json()
    console.log('PUT body', body)
    const openstackConfig = await prisma.openstackKeycloak.update({
      where: {
        userId: userId,
      },
      data: {
        flavor: body.flavor,
        keypair: body.keypair,
        network: body.network,
        keycloakPort: body.keycloakPort,
        realmName: body.realmName,
        adminUsername: body.adminUsername,
        adminPassword: body.adminPassword,
      },
    })
    console.log('PUT update results', openstackConfig)
    return NextResponse.json(
      {
        status: 200,
        data: openstackConfig,
      },
      { status: 200 }
    )
  } catch (error) {
    throw error
  }
}