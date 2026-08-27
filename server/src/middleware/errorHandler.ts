import type { NextFunction, Request, Response } from 'express';
import type { ApiError } from '@fms/shared';
import { AppError } from '../utils/AppError';

export function notFoundHandler(_req: Request, res: Response): void {
  const body: ApiError = { success: false, data: null, message: 'Endpoint bulunamadi', errors: [] };
  res.status(404).json(body);
}

// Central error middleware — every thrown/next(err) lands here (spec madde 52).
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    const body: ApiError = { success: false, data: null, message: err.message, errors: err.errors };
    res.status(err.statusCode).json(body);
    return;
  }

  console.error('[UNHANDLED_ERROR]', err);
  const body: ApiError = {
    success: false,
    data: null,
    message: 'Beklenmeyen bir hata olustu',
    errors: [],
  };
  res.status(500).json(body);
}
