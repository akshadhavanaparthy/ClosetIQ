export * from './color.dto.js';
export * from './auth.dto.js';
export * from './profile.dto.js';
export * from './wardrobe.dto.js';
export * from './product.dto.js';
export * from './recommendation.dto.js';
export * from './analysis.dto.js';
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    meta?: {
        page?: number;
        pageSize?: number;
        totalCount?: number;
        timestamp: string;
    };
}
export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
    timestamp: string;
}
