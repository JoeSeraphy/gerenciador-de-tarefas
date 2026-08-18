import type {NextFunction, Request, Response} from 'express';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key"
)

export async function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error:'Token não fornecido' })
    }

    const [, token] = authHeader.split(' ')

    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET)
        req.user = {
            id: payload.sub as string,
        }
        return next()

    } catch (error) {
        return res.status(401).json({ error:'Token inválido' })
    }
}