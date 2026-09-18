import type { Prisma } from '@prisma/client'

export async function deleteOwnedUser(
    tx: Prisma.TransactionClient,
    userId: string
) {
    // Database cascades serialize deletion with foreign-key-checked visitor writes.
    await tx.user.deleteMany({ where: { id: userId } })
}
