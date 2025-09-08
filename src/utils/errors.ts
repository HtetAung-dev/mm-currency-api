export class AppError extends Error {
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, 400, details)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', details?: unknown) {
    super(message, 404, details)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, 409, details)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', details?: unknown) {
    super(message, 500, details)
  }
}

export function toResponse(err: unknown) {
  if (err instanceof AppError) {
    return { statusCode: err.statusCode, body: { error: err.message, details: err.details } }
  }
  return { statusCode: 500, body: { error: 'Internal Server Error' } }
}


