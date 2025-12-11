export type LogPayload = {
    level: string;
    message: string;
    resourceId: string;
    timestamp: string;
    traceId?: string;
    spanId?: string;
    commit?: string;
    metadata?: {
        parentResourceId?: string;
    };
};

export type LogQueryParams = {
    level?: string;
    message?: string;
    resourceId?: string;
    traceId?: string;
    spanId?: string;
    commit?: string;
    parentResourceId?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
};

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'viewer';
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface Log {
    _id: string;
    level: string;
    message: string;
    resourceId: string;
    timestamp: string;
    traceId: string;
    spanId: string;
    commit: string;
    metadata?: {
        parentResourceId?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface LogsResponse {
    success: boolean;
    data: Log[];
    fromCache?: boolean;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
