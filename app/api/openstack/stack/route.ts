import { NextResponse, NextRequest } from 'next/server'
import { OpenstackConfig } from '../../../../interfaces/openstack'
import { prisma } from '../../../../db'

export async function POST(request: NextRequest) {
  try {
    // get userId from request headers
    const userId: string = request.headers.get('userId') as string
    const xAuthToken: string = request.headers.get('xAuthToken') as string

    if (
      !userId ||
      !xAuthToken ||
      xAuthToken === 'undefined' ||
      userId === 'undefined'
    ) {
      console.log('Missing required field: userId or xAuthToken')
      return NextResponse.json(
        {
          status: 400,
          error: 'Missing required field: userId or xAuthToken',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    console.log('Request Body:', body)

    const allowedFields = [
      'project',
      'flavor',
      'network',
      'keypair',
      'realmName',
      'adminPassword',
      'adminUsername',
      'keycloakPort',
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

    const {
      project,
      flavor,
      network,
      keypair,
      realmName,
      adminPassword,
      adminUsername,
      keycloakPort,
    } = body

    const stackName = project + '-Keycloak-Auto-Deploy-Stack'

    const stackBody = {
      files: {
        deploy: `#!/bin/bash \n## Add Docker\'s official GPG key: \nsudo apt-get update && sudo apt-get upgrade -y \nsudo apt-get install ca-certificates curl \nsudo install -m 0755 -d /etc/apt/keyrings \nsudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \nsudo chmod a+r /etc/apt/keyrings/docker.asc \n## Add the repository to Apt sources: \necho "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \nsudo apt-get update \nsudo apt-get install fish net-tools docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y \n## Create docker compose file for keycloak deployment \necho "version: \'3\' \nservices: \n  keycloak: \n    image: quay.io/keycloak/keycloak:latest \n    container_name: keycloak \n    ports: \n      - \'${keycloakPort}:8080\' \n    environment: \n      - KEYCLOAK_ADMIN=${adminUsername} \n      - KC_SPI_ADMIN_REALM=${realmName} \n      - KEYCLOAK_ADMIN_PASSWORD=${adminPassword} \n    command: start-dev" > /etc/os-release \nsudo docker compose -f /etc/os-release up -d`,
      },
      disable_rollback: true,
      parameters: {
        flavor: `${flavor}`,
      },
      stack_name: `${stackName}`,
      template: {
        heat_template_version: '2013-05-23',
        description: 'Keycloak Stack',
        parameters: {
          flavor: {
            default: `${flavor}`,
            type: 'string',
          },
          image: {
            default: '925cf5db-152f-40c4-9e1a-f94847c845b3', // Ubuntu-Jammy-22.04
            type: 'string',
          },
        },
        resources: {
          keycloak: {
            type: 'OS::Nova::Server',
            properties: {
              name: 'keycloak-server',
              key_name: `${keypair}`,
              flavor: {
                get_param: 'flavor',
              },
              image: '925cf5db-152f-40c4-9e1a-f94847c845b3', // Ubuntu-Jammy-22.04
              networks: [
                {
                  uuid: `${network}`,
                },
              ],
              security_groups: ['default', 'keycloak-security-group'],
              user_data: {
                get_file: 'deploy',
              },
            },
          },
        },
      },
      timeout_mins: 60,
    }

    const openstackConfig = await prisma.openstackKeycloak.findUnique({
      where: {
        userId: userId,
      },
    })

    console.log('Openstack Config:', openstackConfig)

    // create openstack stack
    const response = await fetch(
      `https://dash.cloud.cerist.dz:8004/v1/${openstackConfig?.tenantId}/stacks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': xAuthToken,
        },
        body: JSON.stringify(stackBody),
      }
    )

    const data = await response.json()
    console.log('Create Stack Response Data:', data)
    if (response.status === 201) {
      // update openstack config with stackId
      await prisma.openstackKeycloak.update({
        where: {
          userId: userId,
        },
        data: {
          stackId: data.stack.id,
        },
      })
    } else {
      console.log('Error creating openstack stack')
      return NextResponse.json(
        {
          status: response.status,
          error: 'Error creating openstack stack',
        },
        { status: response.status }
      )
    }

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
