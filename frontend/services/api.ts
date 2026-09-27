const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('@taskmanager:token') : null

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Beare ${token}`} : {}),
        ...options.headers,
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!res.ok) {
        const erroData = await res.json().catch(() => ({}))
        throw new Error(erroData.error || "Ocorreu um erro na requisição")

    }

    if ( res.status === 204) {
        return {} as T
    }

    return res.json()
}