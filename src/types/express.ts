// Express request extension for validated data
declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export {};

