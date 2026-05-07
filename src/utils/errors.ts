export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const createErrorResponse = (statusCode: number, message: string, details?: any) => {
  return {
    success: false,
    statusCode,
    message,
    ...(details && { details }),
  };
};

export const createSuccessResponse = (data: any, message: string = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

