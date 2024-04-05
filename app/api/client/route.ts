import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../db'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  const req = await request.json()

  const { clientId, clientSecret, realmId } = req
  try {
    const client = await prisma.client.create({
      data: {
        clientId,
        clientSecret: await bcrypt.hash(clientSecret, 10),
        realmId,
      },
    })

    return NextResponse.json(client)
  } catch (e) {
    return NextResponse.error()
  }
}
