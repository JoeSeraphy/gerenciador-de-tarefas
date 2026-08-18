import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';

describe('TaskService', () => {
    let taskService: TaskService;
    let taskRepository: TaskRepository;

    beforeEach(() => {
        taskRepository = {
            create: vi.fn(),
            findManyByUserId: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        } as unknown as TaskRepository;

        taskService = new TaskService(taskRepository);
        })
    
        it('deve criar uma tarefa com sucesso', async () => {
            const mockTask = {
                id: "task-1",
                title: "Estudar Vitest",
                description: "Criar teste de unidade",
                status: "PENDING" as const,
                userId: "user-1",
                createdAt: new Date(),
                updatedAt: new Date(), 
            }

            vi.spyOn(taskRepository, 'create').mockResolvedValue(mockTask);

            const result = await taskService.createTask("user-1", {
                title: "Estudar Vitest",
                description: "Criar teste de unidade",
            });

            expect(result).toEqual(mockTask);
            expect(taskRepository.create).toHaveBeenCalledWith("user-1", {
                title: "Estudar Vitest",
                description: "Criar teste de unidade",
            });
        })

        it("deve lançar um erro se o usuário tentar deletar uma tarefa que pertence a outro usario",
             async () => {
                const mockTask = {
                    id: "task-1",
                    title: "Tarefa secreta",
                    description: null,
                    status: "PENDING" as const,
                    userId: "user-dono-da-tarefa",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }

                vi.spyOn(taskRepository, 'findById').mockResolvedValue(mockTask);

                await expect(
                    taskService.deleteTask("user-intruso", "task-1")
                ).rejects.toThrow("cesso negado: essa tarefa pertence a outro usuário");
             })
})