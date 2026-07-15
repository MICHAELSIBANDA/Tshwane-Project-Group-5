import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

const targetDbName = process.env.DB_NAME || 'auth_db';

let pool: Pool;

// Helper function to create the database if it doesn't exist
async function ensureDatabaseExists() {
  // Connect to the default 'postgres' database first to check/create the target database
  const client = new Client({
    ...dbConfig,
    database: 'postgres', // connect to default postgres db
  });

  try {
    await client.connect();
    
    // Check if the database exists
    const checkDbResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [targetDbName]
    );

    if (checkDbResult.rowCount === 0) {
      console.log(`Database "${targetDbName}" does not exist. Creating it...`);
      // We must run CREATE DATABASE outside of a transaction block
      await client.query(`CREATE DATABASE ${targetDbName}`);
      console.log(`Database "${targetDbName}" created successfully.`);
    } else {
      console.log(`Database "${targetDbName}" already exists.`);
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Function to initialize the connection pool and run table setup queries
export async function initDatabase() {
  try {
    // 1. Ensure the DB itself exists
    await ensureDatabaseExists();

    // 2. Initialize the main connection pool for the target database
    pool = new Pool({
      ...dbConfig,
      database: targetDbName,
    });

    // Test connection
    const client = await pool.connect();
    console.log(`Connected to database "${targetDbName}" successfully.`);
    client.release();

    // 3. Create the users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
    console.log('Users table checked/created successfully.');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Export a query method to be used by other parts of the application
export const query = (text: string, params?: any[]) => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase() first.');
  }
  return pool.query(text, params);
};

export { pool };
