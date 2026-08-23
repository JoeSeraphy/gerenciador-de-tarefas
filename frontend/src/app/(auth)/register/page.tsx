'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {z} from 'zod'
import { Card, CardContent, CardDescription, 
    CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { apiFetch } from '@/services/api'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'



const registerSchema = z.object({
    name: z.string().min(4, "O nome deve ter no mínimo 4 caracteres"),
    email: z.string().email("Insira um e-mail válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    async function handleRegister(data: RegisterForm) {
        try {
            setIsLoading(true)
            setError(null)

           await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify(data)
            })

            router.push('/login')
        }catch (err: any) {
            setError(err.message || "Erro ao realizar login")
        } finally {
            setIsLoading(false)
        }
    }

   return (
    <div className='min-h-screen flex items-center justify-center bg=slate-50 p-4'>
        <Card className='w-full max-w-md'>
            <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl font-bold'>Criar Conta</CardTitle>
                <CardDescription>Cadastre-se para começar a gerenciar suas tarefas</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleRegister)}>
            <CardContent className='space-y-4'>
                {error && (
                    <div className='bg-red-50 text-red-600 text-sm p-3 roundend-md border border-red-200'> 
                        {error}
                        </div>
                )}
                <div className='space-y-2'>
                    <Label htmlFor='name'>Nome Completo</Label>
                    <Input
                    id="name"
                    placeholder='Seu nome'
                    {...register('name')}
                    />
                    {errors.name && (
                        <p className='text-xs text-red-500'>{errors.name.message}</p>
                    )}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='email'>E-mail</Label>
                    <Input
                    id="email"
                    type='email'
                    placeholder='seu@email.com'
                    {...register('email')}
                    />
                    {errors.email && (
                        <p className='text-xs text-red-500'>{errors.email.message}</p>
                    )}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='password'>Senha</Label>
                    <Input
                    id="password"
                    type='password'
                    placeholder='********'
                    {...register('password')}
                    />
                    {errors.password && (
                        <p className='text-xs text-red-500'>{errors.password.message}</p>
                    )}
                </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
                <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                </Button>
                <p className='text-xs text-center text-slate-600'>
                    Já possui uma conta?{' '}
                    <Link href='/login' className='text-blue-600 underline font-medium'>
                        Faça login
                    </Link>
                </p>
            </CardFooter>
            </form>
        </Card>
    </div>
   )
}