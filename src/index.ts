import express from 'express';
import { config } from './config';
import { initializeDatabase, closeDatabase } from './database';
import {
  setupCors,
  setupSecurity,
  setupLogging,
  setupParsers,
  setupErrorHandler,
  setup404Handler,
} from './middleware';
import apiRoutes from './routes';

const app = express();

// Middleware setup
setupCors(app);
setupSecurity(app);
setupLogging(app);
setupParsers(app);

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
setupErrorHandler(app);
setup404Handler(app);

// Initialize server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✓ Database initialized');

    // Start server
    app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════╗
║  CinemaVault Backend API               ║
║  Server running on port ${config.port}         ║
║  Environment: ${config.nodeEnv}            ║
║  http://localhost:${config.port}              ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

startServer();

export default app;

