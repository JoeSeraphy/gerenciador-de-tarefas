import { describe, it, expect} from 'vitest';
import request from 'supertest';
import { app } from '../../app';

describe("Rotas de Autenticação (Integração)", () => {
    it("deve falhar ao tentar registrar usuário com e-mail inválido", async () => {
        const res = await request(app).post("/auth/register").send({
            name: "Joelson",
            email: "joelson@email.com",
            password: "123456"
        });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    })
    it("deve recusar acesso a rotas protegidas sem o header de autorização", async () => {
        const res = await request(app).get("/tasks");
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Token não fornecido");
    })
})