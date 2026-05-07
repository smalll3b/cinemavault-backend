import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from '../config';
import { AppError } from '../utils/errors';

// CORS Middleware
export const setupCors = (app: Express) => {
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));
};

// Security Middleware
export const setupSecurity = (app: Express) => {
  app.use(helmet());
};

// Logging Middleware
export const setupLogging = (app: Express) => {
  app.use(morgan('combined'));
};

// Request Parser Middleware
export const setupParsers = (app: Express) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
};

// Error Handling Middleware
export const setupErrorHandler = (app: Express) => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    if (err.message === 'CORS not allowed') {
      return res.status(403).json({
        success: false,
        message: 'CORS not allowed',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  });
};

// 404 Handler
export const setup404Handler = (app: Express) => {
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });
};


