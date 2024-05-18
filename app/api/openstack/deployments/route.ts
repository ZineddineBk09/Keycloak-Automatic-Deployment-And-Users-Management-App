import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../db'

// get request handler to retreive all deployments
export async function GET(request: NextRequest) {
  try {
    // get userId from request headers
    const userId: string = request.headers.get('userId') as string
    const deployments = await prisma.deployment.findMany({
      where: {
        userId: userId,
      },
    })
    return NextResponse.json(
      {
        status: 200,
        data: deployments,
      },
      { status: 200 }
    )
  } catch (error) {
    throw error
  }
}


