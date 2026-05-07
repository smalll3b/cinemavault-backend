import { initializeDatabase } from './index';

// Run database initialization
initializeDatabase()
  .then(() => {
    console.log('✓ Database initialization completed successfully!');
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  });


