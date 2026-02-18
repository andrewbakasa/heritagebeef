

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prisma: PrismaClient | undefined;
}

const client = global.prisma || prismaClientSingleton();

export default client

 if (process.env.NODE_ENV !== 'production') {
     global.prisma = client;
}

