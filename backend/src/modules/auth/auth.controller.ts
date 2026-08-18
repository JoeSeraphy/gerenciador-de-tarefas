import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { registerSchema, loginSchema } from './auth.schema'

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(req: Request, res: Response) {
        try {
            const data = registerSchema.parse(req.body)
            const user = await this.authService.register(data)
           return res.status(201).json(user)
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error.errors })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = loginSchema.parse(req.body)
            const results = await this.authService.login(data)
            return res.json(results)
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error.errors })
        }
    }
}