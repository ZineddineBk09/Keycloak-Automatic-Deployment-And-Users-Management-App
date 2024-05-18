import { NextResponse } from 'next/server'
import { prisma } from '../../../../db'
import { NextApiRequest } from 'next'

// get request handler to retreive deployment by id
export async function GET(request: NextApiRequest) {
  try {
    // get userId from request headers
    const deploymentId: string = request.query.deploymentId as string
    const deployment = await prisma.deployment.findUnique({
      where: {
        id: deploymentId,
      },
    })
    return NextResponse.json(
      {
        status: 200,
        data: deployment,
      },
      { status: 200 }
    )
  } catch (error) {
    throw error
  }
}
