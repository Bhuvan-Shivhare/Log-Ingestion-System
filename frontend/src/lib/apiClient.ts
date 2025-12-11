import axios from 'axios';
import { LogPayload, LogQueryParams, AuthResponse, LogsResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
console.log('DEBUG: apiClient BASE_URL is:', BASE_URL);

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Prevent infinite loop if already on login
                if (!window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
};

export const register = async (name: string, email: string, password: string, role: string = 'viewer'): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', { name, email, password, role });
    return response.data;
};

export const createLog = async (payload: LogPayload): Promise<any> => {
    const response = await apiClient.post('/api/logs', payload);
    return response.data;
};

export const getLogs = async (params: LogQueryParams): Promise<LogsResponse> => {
    const response = await apiClient.get<LogsResponse>('/api/logs', { params });
    return response.data;
};

export default apiClient;
