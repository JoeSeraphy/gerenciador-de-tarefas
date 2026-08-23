'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import {z} from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { apiFetch } from '@/services/api'
import { AuthResponse } from '@/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'



const loginSchema = z.object({
    email: z.string().email('Insira um e-mail válido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    async function handleLogin(data: LoginForm) {
        try {
            setIsLoading(true)
            setError(null)

            const res = await apiFetch<AuthResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify(data)
            })

            localStorage.setItem("@taskmanager:token", res.token)
            localStorage.setItem("@taskmanager:user", JSON.stringify(res.user))

            router.push('/dashboard')
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
                <CardTitle className='text-2xl font-bold'>Acessar Conta</CardTitle>
                <CardDescription>Insira sua credenciais para gerenciar suas tarefas</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleLogin)}>
            <CardContent className='space-y-4'>
                {error && (
                    <div className='bg-red-50 text-red-600 text-sm p-3 roundend-md border border-red-200'> 
                        {error}
                        </div>
                )}
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
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
                <p className='text-xs text-center text-slate-600'>
                    Ainda não tem uma conta?{' '}
                    <Link href='/register' className='text-blue-600 underline font-medium'>
                        Cadastre-se
                    </Link>
                </p>
            </CardFooter>
            </form>
        </Card>
    </div>
   )
}