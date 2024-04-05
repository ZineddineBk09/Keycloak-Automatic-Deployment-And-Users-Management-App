import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../db'

// handle the logic for the POST request where the client send hist clientId/clientSecret to get an access token form the keycloak server
// http://localhost:8080/realms/master/protocol/openid-connect/token

export async function POST(request: NextRequest) {}
