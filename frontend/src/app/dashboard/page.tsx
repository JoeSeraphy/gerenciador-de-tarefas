'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/services/api"
import { Task, User } from "@/types"
import { CheckCircle2, Clock, Loader2, LogOut, Plus, Trash2 } from "lucide-react"
import router, { useRouter } from "next/router"
import { useEffect, useState } from "react"


export default function DashboardPage() {
   
    const [user, setUser] = useState<User | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const storedUser = localStorage.getItem('@taskmanager:user')
        const token = localStorage.getItem('@taskmanager:token')

        if (!token || !storedUser) {
            router.replace('/login')
            return
        }

        try{
        setUser(JSON.parse(storedUser))
        }catch {
         router.replace('/login')
         return
        }

        apiFetch<Task[]>('/tasks')
        .then((data) => {
          setTasks(Array.isArray(data) ? data : [])
        })
        .catch((err) => {
          console.error('Erro ao buscar tarefas:', err.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, [])


    async function handleCreateTask(e: React.FormEvent){
        e.preventDefault()
        if (!title.trim()) return

        try {
            setIsSubmitting(true)
            const newTask = await apiFetch<Task>('/tasks', {
                method: 'POST',
                body: JSON.stringify({ title, description}),
            })

            setTasks((prev) => [newTask, ...prev])
            setTitle('')
            setDescription('')
        } catch (err: any) {
            alert(err.message || "Error ao  criar tarefa")
        } finally {
            setIsSubmitting(false)
        }
    }
    
    async function handleToggleStatus(task: Task) {
        const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    
        try {
            const updatedTask = await apiFetch<Task>(`/tasks/${task.id}`,{
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: nextStatus})
        })

        setTasks((prev) => 
            prev.map((t) => (t.id === task.id ? updatedTask : t))
    )
        }catch (err: any) {
            alert(err.message || "Erro ao atualizar tarefa")
        }
    }

    async function handleDeleteTask(id: string) {
        if (!confirm("Deseja realmente excluir esta tarefa?")) return
        
        try {
            await apiFetch(`/tasks/${id}`, {method:'DELETE'})
            setTasks((prev) => prev.filter((t) => t.id !== id))
        } catch (err: any) {
            alert(err.message || "Erro ao deletar tarefa")
        }

    }

    function handleLogout() {
      localStorage.removeItem('@taskmanager:token')
      localStorage.removeItem('@taskmanager:user')
      router.replace('/login')
    }

    return (
       <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Minhas Tarefas</h1>
          <p className="text-xs text-slate-500">
            Olá, {user?.name || 'Usuário'} ({user?.email})
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
       
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Título da tarefa *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Input
                  placeholder="Descrição (opcional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Salvando...' : 'Adicionar Tarefa'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Tarefas */}
        <div className="space-y-3">
          <h2 className="text-md font-semibold text-slate-700">
            Tarefas ({tasks.length})
          </h2>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : tasks.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-sm">
              Nenhuma tarefa cadastrada até o momento.
            </Card>
          ) : (
            tasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all ${
                  task.status === 'COMPLETED' ? 'bg-slate-50 opacity-75' : ''
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          task.status === 'COMPLETED'
                            ? 'line-through text-slate-400'
                            : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </span>
                      <Badge
                        variant={
                          task.status === 'COMPLETED' ? 'default' : 'secondary'
                        }
                      >
                        {task.status === 'COMPLETED' ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Concluída
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pendente
                          </span>
                        )}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(task)}
                    >
                      {task.status === 'COMPLETED' ? 'Desmarcar' : 'Concluir'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
     )   
}