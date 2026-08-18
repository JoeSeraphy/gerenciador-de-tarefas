import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(4, { message: "O nome deve ter no mínimo 4 caracteres" }),
  email: z.string().email({ message: "Insira um e-mail válido" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;