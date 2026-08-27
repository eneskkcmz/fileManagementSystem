import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '@fms/shared';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

/** Thrown for any non-success API response; carries field errors for forms. */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly errors: { field: string; message: string }[] = [],
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/** Unwrap the `{ success, data, message }` envelope into just `data` (or throw). */
async function request<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const res = await promise;
    if (res.data.success) return res.data.data;
    throw new ApiRequestError(res.data.message, res.data.errors);
  } catch (err) {
    if (err instanceof ApiRequestError) throw err;
    const axErr = err as AxiosError<ApiResponse<never>>;
    const body = axErr.response?.data;
    if (body && body.success === false) {
      throw new ApiRequestError(body.message, body.errors, axErr.response?.status);
    }
    throw new ApiRequestError(axErr.message ?? 'Baglanti hatasi', [], axErr.response?.status);
  }
}

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>) => request<T>(api.get(url, { params })),
  post: <T>(url: string, body: unknown) => request<T>(api.post(url, body)),
  put: <T>(url: string, body: unknown) => request<T>(api.put(url, body)),
  patch: <T>(url: string, body: unknown) => request<T>(api.patch(url, body)),
  del: <T>(url: string) => request<T>(api.delete(url)),
};
