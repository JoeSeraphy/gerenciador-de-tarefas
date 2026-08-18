# 📝 Task Manager - Fullstack Application

Uma aplicação moderna de gerenciamento de tarefas desenvolvida com arquitetura desacoplada (Clean Architecture), autenticação segura via JWT, persitência em PostgreSQL com Prisma ORM e interface responsiva em Next.js 14.

---

## 🚀 Tecnologias Utilizadas

### **Backend**
- **Node.js** com **TypeScript**
- **Express.js** (API REST)
- **Prisma ORM** + **PostgreSQL**
- **Zod** (Validação de schemas e payloads)
- **Jose** (Autenticação JWT)
- **Vitest** + **Supertest** (Testes unitários e de integração)
- **Docker** & **Docker Compose**

### **Frontend**
- **Next.js 14** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** / **Lucide React** (Componentes de UI e ícones)

---

## 🧱 Arquitetura e Decisões de Design

O backend foi construído seguindo os princípios de **Clean Architecture** e **Inversão de Dependência (DIP)**:
- **Repositórios (Repositories):** Camada responsável pela comunicação direta com o banco de dados via Prisma.
- **Serviços (Services/Use Cases):** Contém as regras de negócio puras e isoladas da infraestrutura.
- **Controladores (Controllers):** Lidam com as requisições HTTP e validações via Zod.
- **Isolamento de Dados:** Cada tarefa pertence estritamente ao usuário autenticado que a criou.

---

## 💻 Como Rodar o Projeto Localmente

### **Pré-requisitos**
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) e Docker Compose

---

### **1. Clonar o Repositório**

```bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
cd SEU_REPOSITORIO