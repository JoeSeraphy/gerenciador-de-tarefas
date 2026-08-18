import {z} from 'zod'

export const createTaskSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    description: z.string().optional(),
})

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
})

export type CreateTaskDTO = z.infer<typeof createTaskSchema>
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>
