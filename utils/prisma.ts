import { prisma } from '../db'

export const deleteClient = async (clientId: string) => {
  try {
    await prisma.client.delete({
      where: {
        clientId,
      },
    })
  } catch (err) {
    console.error(err)
    throw new Error('Error deleting client')
  }
}
