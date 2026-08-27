import type { FieldError } from '@fms/shared';

/** Domain/HTTP error carried up to the global error handler (spec madde 52). */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors: FieldError[] = [],
  ) {
    super(message);
    this.name = 'AppError';
  }

  static notFound(message = 'Kayit bulunamadi'): AppError {
    return new AppError(404, message);
  }

  static badRequest(message: string, errors: FieldError[] = []): AppError {
    return new AppError(400, message, errors);
  }

  static conflict(message: string): AppError {
    return new AppError(409, message);
  }
}
