import path from 'path';
import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const resolvedHost = process.env.DB_HOST || process.env.PGHOST || 'localhost';
const isRemoteHost = !['localhost', '127.0.0.1', '::1'].includes(resolvedHost);
const sslConfig = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1' || isRemoteHost
  ? { rejectUnauthorized: false }
  : undefined;

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: resolvedHost,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  ...(sslConfig ? { ssl: sslConfig } : {}),
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
    console.log(`Using database host: ${dbConfig.host}`);

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

    // 3. Drop existing users table if it has old schema and create new one
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('Old users table dropped (if existed).');

    const createTableQuery = `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone_number VARCHAR(20) UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'Passenger' CHECK (role IN ('Passenger', 'Driver', 'Admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CHECK (email IS NOT NULL OR phone_number IS NOT NULL)
      );
    `;
    await pool.query(createTableQuery);
    console.log('Users table created successfully with new schema.');

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
