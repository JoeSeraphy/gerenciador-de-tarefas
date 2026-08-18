import {TaskRepository} from './task.repository';
import {CreateTaskDTO, UpdateTaskDTO} from './task.schema';

export class TaskService {
    constructor(private taskRepository: TaskRepository) {}

    async createTask(userId: string, data: CreateTaskDTO) {
        return this.taskRepository.create(userId, data);
    }

    async listTasks(userId: string) {
        return this.taskRepository.findManyByUserId(userId);
    }

    async updateTask(userId: string, taskId: string, data: UpdateTaskDTO) {
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new Error('tarefa não encontrada');
        }

        if (task.userId !== userId) {
            throw new Error('Acesso negado: essa tarefa pertence a outro usuário')
        }

        return this.taskRepository.update(taskId, data);
    }

    async deleteTask(userId: string, taskId: string) {
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new Error('tarefa não encontrada');
        }

        if (task.userId !== userId) {
            throw new Error('Acesso negado: essa tarefa pertence a outro usuário')
        }

        return this.taskRepository.delete(taskId);
    }
}