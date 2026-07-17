import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis configuration from environment variables
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

// Create Redis client instance
// Redis is an in-memory data store used for caching and temporary data storage
// It's much faster than database operations and supports automatic expiration (TTL)
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    // Retry connection with exponential backoff
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Event listeners for Redis connection
redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redis.on('error', (err: Error) => {
  console.error('Redis connection error:', err);
});

/**
 * Store a password reset verification code in Redis with automatic expiration
 * @param email - User's email address (used as key identifier)
 * @param verificationCode - 6-digit verification code
 * @param expirationSeconds - Time in seconds before code expires (default: 600 = 10 minutes)
 */
export async function storeVerificationCode(email: string, verificationCode: string, expirationSeconds: number = 600): Promise<void> {
  // Store the verification code with email as key
  // The 'EX' option sets the expiration time in seconds
  // Redis will automatically delete the key after expiration
  await redis.set(`reset_code:${email}`, verificationCode, 'EX', expirationSeconds);
}

/**
 * Verify a password reset code
 * @param email - User's email address
 * @param code - 6-digit verification code to verify
 * @returns true if code matches and is valid, false otherwise
 */
export async function verifyResetCode(email: string, code: string): Promise<boolean> {
  // Get the stored code for this email
  const storedCode = await redis.get(`reset_code:${email}`);
  // Compare the provided code with the stored code
  return storedCode === code;
}

/**
 * Delete a verification code from Redis (used after successful password reset)
 * @param email - User's email address
 */
export async function deleteVerificationCode(email: string): Promise<void> {
  // Remove the verification code from Redis to prevent reuse
  await redis.del(`reset_code:${email}`);
}

// Export the Redis client for direct operations if needed
export default redis;
