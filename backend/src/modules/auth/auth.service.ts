import bcrypt from "bcryptjs";
import * as jose from "jose";
import { AuthRepository } from "./auth.repository";
import { LoginDTO, RegisterDTO } from "./auth.schema";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key"
)

export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    async register(data: RegisterDTO) {
        const userExists = await this.authRepository.findUserByEmail(data.email)
        if (userExists) {
      throw new Error('E-mail já cadastrado')
    }

    const hashedPassword = await bcrypt.hash(data.password, 8)

    const user = await this.authRepository.createUser({
      ...data,
      password: hashedPassword,
    })

    return { id: user.id, name: user.name, email: user.email }
  }

  async login(data: LoginDTO) {
    const user = await this.authRepository.findUserByEmail(data.email)
    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) {
      throw new Error('Credenciais inválidas')
    }
    const token = await new jose.SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT_SECRET)
    return {
      user: { id: user.id, name: user.name, email: user.email }, 
      token,
    }   
  }
}