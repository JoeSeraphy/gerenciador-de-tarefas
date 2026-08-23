export interface User {
    id: string,
    name: string,
    email: string
}

export interface Task {
    id: string,
    title: string,
    description?: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
    createdAt: string
}

export interface AuthResponse {
    user: User,
    token: string
}