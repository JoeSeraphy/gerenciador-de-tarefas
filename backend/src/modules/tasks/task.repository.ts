import { CreateTaskDTO, UpdateTaskDTO } from "./task.schema";
import { prisma } from "../../lib/prisma";

export class TaskRepository {
    async create(userId: string, data: CreateTaskDTO) {
        return prisma.task.create({
            data: {
                ...data,
                userId,
            },
        })
    }

    async findManyByUserId(userId: string) {
        return prisma.task.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
        })
    }

    async findById(id: string) {
        return prisma.task.findUnique({
            where: {id},
        })
    }

    async update(id: string, data: UpdateTaskDTO) {
        return prisma.task.update({
            where: {id},
            data,
        })
    }

    async delete(id: string) {
        return prisma.task.delete({
            where: {id},
        })
    }
}