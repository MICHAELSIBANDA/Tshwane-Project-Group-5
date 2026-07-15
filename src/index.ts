import app from './app';
import { initDatabase, pool } from './config/db';

const PORT = parseInt(process.env.PORT || '3001', 10);

async function startServer() {
  try {
    // 1. Initialize DB and schema
    console.log('Initializing database setup...');
    await initDatabase();

    // 2. Start Express app listening
    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  Auth Service running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`  Server listening on port: ${PORT}`);
      console.log(`  Health check: http://localhost:${PORT}/health`);
      console.log(`===============================================`);
    });

    // 3. Graceful shutdown handler
    const gracefulShutdown = async () => {
      console.log('\nShutdown signal received. Starting graceful shutdown...');
      
      server.close(() => {
        console.log('HTTP server closed.');
      });

      if (pool) {
        try {
          await pool.end();
          console.log('Database connection pool closed.');
        } catch (dbErr) {
          console.error('Error closing database pool:', dbErr);
        }
      }

      console.log('Graceful shutdown completed. Exiting process.');
      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
