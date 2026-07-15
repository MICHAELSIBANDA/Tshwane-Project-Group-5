"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.query = void 0;
exports.initDatabase = initDatabase;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
};
const targetDbName = process.env.DB_NAME || 'auth_db';
let pool;
// Helper function to create the database if it doesn't exist
async function ensureDatabaseExists() {
    // Connect to the default 'postgres' database first to check/create the target database
    const client = new pg_1.Client({
        ...dbConfig,
        database: 'postgres', // connect to default postgres db
    });
    try {
        await client.connect();
        // Check if the database exists
        const checkDbResult = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [targetDbName]);
        if (checkDbResult.rowCount === 0) {
            console.log(`Database "${targetDbName}" does not exist. Creating it...`);
            // We must run CREATE DATABASE outside of a transaction block
            await client.query(`CREATE DATABASE ${targetDbName}`);
            console.log(`Database "${targetDbName}" created successfully.`);
        }
        else {
            console.log(`Database "${targetDbName}" already exists.`);
        }
    }
    catch (error) {
        console.error('Error ensuring database exists:', error);
        throw error;
    }
    finally {
        await client.end();
    }
}
// Function to initialize the connection pool and run table setup queries
async function initDatabase() {
    try {
        // 1. Ensure the DB itself exists
        await ensureDatabaseExists();
        // 2. Initialize the main connection pool for the target database
        exports.pool = pool = new pg_1.Pool({
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
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}
// Export a query method to be used by other parts of the application
const query = (text, params) => {
    if (!pool) {
        throw new Error('Database pool not initialized. Call initDatabase() first.');
    }
    return pool.query(text, params);
};
exports.query = query;
