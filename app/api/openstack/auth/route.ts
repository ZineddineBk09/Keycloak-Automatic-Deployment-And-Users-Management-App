import { NextResponse, NextRequest } from 'next/server'
import axios from '../../../../lib/axios/openstack'
import endpoints from '../../../../utils/endpoints'

// since we're using a multi-step form, we need to save the user's information from each step and the each step informations in db


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
      'identityEndpoint',
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
    const identityEndpoint = body.identityEndpoint.replace(/\/$/, '').trim()

    // send a post request to the identity endpoint
    const response = await axios
      .post(`${identityEndpoint + '/' + endpoints.authEndpoint}`, {
        auth: {
          identity: {
            methods: ['password'],
            password: {
              user: {
                name: body.username,
                domain: {
                  name: body.domain,
                },
                password: body.password,
              },
            },
          },
          scope: {
            project: {
              name: body.project,
              domain: {
                name: body.domain,
              },
            },
          },
        },
      })
      .then((res) => {
        const headers = res.headers
        // concatenate the response headers to the response data
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
        data: response?.data,
      },
      { status: 200, headers: response?.headers }
    )
  } catch (error) {
    console.log('error')
  }
}
