import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../db'
import {
  createSecurityGroup,
  createSecurityGroupRule,
} from '../../../../lib/api/openstack'

export async function POST(request: NextRequest) {
  // get users from keycloak server
  try {
    // get username, project, password, and domain from request body
    const body = await request.json()
    console.log('request body:', body)
    const allowedFields = [
      'flavor',
      'keypair',
      'network',
      'keycloakPort',
      'xAuthToken',
      'userId',
    ]

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

    // Try catch block to create a new security group with openstack api, and save the new values to the database
    try {
      // create a new security group with openstack api
      const xAuthToken: string = body?.xAuthToken

      const openstackConfig = await prisma.openstackKeycloak.findUnique({
        where: {
          userId: body?.userId,
        },
      })

      //Try catch block to handle openstack API error
      try {
        const secGroup = await createSecurityGroup(
          openstackConfig?.baseUrl ?? '',
          xAuthToken,
          {
            security_group: {
              name: 'keycloak-security-group',
              description: 'Security group for keycloak server',
            },
          }
        )
        console.log('created security group:', secGroup)
        // create rule inside the created security group to open "keycloakPort"
        console.log('creating new security rule...')

        const secGroupRule = await createSecurityGroupRule(
          openstackConfig?.baseUrl ?? '',
          xAuthToken,
          {
            security_group_rule: {
              security_group_id: secGroup.security_group.id,
              direction: 'ingress',
              ethertype: 'IPv4',
              port_range_max: body?.keycloakPort,
              port_range_min: body?.keycloakPort,
              protocol: 'tcp',
            },
          }
        )
        console.log('created security rule:', secGroupRule)
      } catch (error) {
        console.log('Error creating security group:', error)
      } finally {
        // if the security group already exists or openstack limit reached, ignore the error and continue
        console.log('Updating openstackKeycloak object...', {
          flavor: body?.flavor,
          keypair: body?.keypair,
          network: body?.network,
          keycloakPort: body?.keycloakPort,
          securityGroup: 'keycloak-security-group',
          userId: body?.userId,
        })
        await prisma.openstackKeycloak.update({
          where: {
            userId: body?.userId,
          },
          data: {
            flavor: body?.flavor,
            keypair: body?.keypair,
            network: body?.network,
            keycloakPort: body?.keycloakPort,
            securityGroup: 'keycloak-security-group',
          },
        })
      }

      return NextResponse.json(
        {
          status: 200,
          data: {
            message: 'Openstack config updated successfully!',
          },
        },
        { status: 200 }
      )
    } catch (error) {
      console.log('Error updating openstackKeycloak object:', error)
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
    console.log('Error updating openstack config:', error)
    return NextResponse.json(
      {
        status: 500,
        error: 'Error updating openstack config',
      },
      { status: 500 }
    )
  }
}
