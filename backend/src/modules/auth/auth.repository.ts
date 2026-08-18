import { prisma } from '../../lib/prisma';
import  { RegisterDTO } from './auth.schema';

export class AuthRepository {
    async findUserByEmail(email: string) {
        return prisma.user.findUnique(
            {where: {email}})
    }

async createUser(data: RegisterDTO) {
    return prisma.user.create({data})
}

async findUserById(id: string) {
    return prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }
    })
}
}
