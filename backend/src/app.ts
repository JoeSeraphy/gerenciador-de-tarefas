import express from 'express';
import cors from 'cors';

import { AuthRepository } from './modules/auth/auth.repository';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';

import { TaskRepository } from './modules/tasks/task.repository';
import { TaskService } from './modules/tasks/task.service';
import { TaskController } from './modules/tasks/task.controller';

import { ensureAuthenticated } from './middlewares/ensure-authenticated';

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

app.post('/auth/register', (req, res) => authController.register(req, res));
app.post('/auth/login', (req, res) => authController.login(req, res));

app.post('/tasks', ensureAuthenticated, (req, res) => taskController.create(req, res));
app.get('/tasks', ensureAuthenticated, (req, res) => taskController.list(req, res));
app.put('/tasks/:id', ensureAuthenticated, (req, res) => taskController.update(req, res));
app.delete('/tasks/:id', ensureAuthenticated, (req, res) => taskController.delete(req, res));

export { app };