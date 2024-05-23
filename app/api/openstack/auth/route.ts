import { NextResponse, NextRequest } from 'next/server'
import axios from '../../../../lib/axios/openstack'
import endpoints from '../../../../utils/endpoints'
import { prisma } from '../../../../db'


export async function POST(request: NextRequest) {
  // get users from keycloak server
  try {
    // get username, project, password, and domain from request body
    const body = await request.json()
    const allowedFields = [
      'username',
      'project',
      'password',
      'domain',
      'baseUrl',
    ]

    // check if the request body contains the required fields
    for (const field of allowedFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            status: 400,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        )
      }
    }

    // get the identity endpoint from the request body
    const baseUrl: string = body?.baseUrl.replace(/\/$/, '').trim()
    const identityEndpoint: string = baseUrl + endpoints.authEndpoint

    // send a post request to the identity endpoint
    const response: any = await axios
      .post(identityEndpoint, {
        auth: {
          identity: {
            methods: ['password'],
            password: {
              user: {
                name: body?.username,
                domain: {
                  name: body?.domain,
                },
                password: body?.password,
              },
            },
          },
          scope: {
            project: {
              name: body?.project,
              domain: {
                name: body?.domain,
              },
            },
          },
        },
      })
      .then(async (res) => {
        const headers = res.headers
        // create new OpenstackKeycloak object
        try {
          // check if user already exist
          const user = await prisma.openstackKeycloak.findUnique({
            where: {
              userId: res?.data?.token?.user?.id,
            },
          })
          if (user) {
            // update the user's project and domain
            console.log('Update existing openstack keycloak config!')
            await prisma.openstackKeycloak.update({
              where: {
                userId: res.data?.token.user.id,
              },
              data: {
                project: body?.project,
                domain: body?.domain,
                baseUrl: body?.baseUrl,
                tenantId: res?.data?.token?.project?.id,
              },
            })
          } else {
            console.log('Create new openstack keycloak config!')
            const config = await prisma.openstackKeycloak.create({
              data: {
                username: body?.username,
                userId: res?.data?.token?.user?.id,
                project: body?.project,
                domain: body?.domain,
                baseUrl: body?.baseUrl,
                tenantId: res?.data?.token?.project?.id,
              },
            })
          }
        } catch (error) {
          console.log('error creating openstackKeycloak object', error)
          return NextResponse.json(
            {
              status: 500,
              data: {
                message: 'error creating openstackKeycloak object',
              },
            },
            { status: 500 }
          )
        }
        return {
          data: res.data,
          headers: {
            'x-subject-token': headers['x-subject-token'],
            'x-openstack-request-id': headers['x-openstack-request-id'],
          },
        }
      })
      .catch((error) => {
        console.log('error')
      })

    return NextResponse.json(
      {
        status: 200,
        data: response?.data || {},
      },
      { status: 200, headers: response?.headers }
    )
  } catch (error) {
    console.log('error')
  }
}
