export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BackendResponse<T> {
  success?: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  data?: T | null;
}

export interface ApiErrorShape {
  message: string;
  errors?: Record<string, string[]>;
}
