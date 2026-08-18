import type { Request, Response } from 'express';
import { TaskService } from './task.service';
import { createTaskSchema, updateTaskSchema } from './task.schema';
import z from 'zod';

export class TaskController {
    constructor(private taskService: TaskService) {}

    async create(req: Request, res: Response) {
        try{
        const userId = req.user!.id;
        const data = createTaskSchema.parse(req.body);
        const task = await this.taskService.createTask(userId, data);
        return res.status(201).json(task);
        }  catch (error: any) {
             return res.status(400).json({ error: error.message || error.errors });
        }
    }
    
    async list(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const tasks = await this.taskService.listTasks(userId);
            return res.status(200).json(tasks);
        } catch (error: any) {
            return res.status(400).json({ error: 'Erro interno do servidor' })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
                    const {id} = z.object({id: z.string().uuid()}).parse(req.params);
            const data = updateTaskSchema.parse(req.body);
            const task = await this.taskService.updateTask(userId, id, data);
            return res.status(200).json(task);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error.errors });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = (req.user as {id: string}).id;
            const {id} = z.object({id: z.string().uuid()}).parse(req.params);
            await this.taskService.deleteTask(userId, id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error.errors });
        }
    } 
}

