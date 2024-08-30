//this is necessary because when we continuously keep on running npm run dev it start making new prismaclient every time
//and the postgres starts screaming as max connection request has been reached and to avoid it this is the file
import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () =>{
    return new PrismaClient();
}

type PrismaClientSingleton = ReturnType<typeof PrismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();

export default prisma;

if(process.env.NODE_ENV != "production") globalForPrisma.prisma = prisma;