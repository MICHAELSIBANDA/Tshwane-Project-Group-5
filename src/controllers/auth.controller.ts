import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../config/db';
import { sendPasswordResetEmail } from '../services/email.service';
import { storeVerificationCode, verifyResetCode, deleteVerificationCode } from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export async function register(req: Request, res: Response): Promise<void> {
  const { full_name, email, phone_number, password, role } = req.body;
  const userRole = role || 'Passenger';

  const normalizedEmail = email ? email.toLowerCase().trim() : null;
  const normalizedPhone = phone_number ? phone_number.trim() : null;

  try {
    // 1. Check if user already exists (by email or phone_number)
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (normalizedEmail) {
      conditions.push(`email = $${paramIndex}`);
      params.push(normalizedEmail);
      paramIndex++;
    }
    if (normalizedPhone) {
      conditions.push(`phone_number = $${paramIndex}`);
      params.push(normalizedPhone);
      paramIndex++;
    }

    if (conditions.length > 0) {
      const existingUserCheck = await query(
        `SELECT id, full_name, email, phone_number FROM users WHERE ${conditions.join(' OR ')}`,
        params
      );

      if (existingUserCheck.rowCount && existingUserCheck.rowCount > 0) {
        const existingUser = existingUserCheck.rows[0];
        if (normalizedEmail && existingUser.email === normalizedEmail) {
          res.status(409).json({
            status: 'error',
            message: 'Conflict',
            errors: { email: 'Email is already registered.' },
          });
          return;
        }
        if (normalizedPhone && existingUser.phone_number === normalizedPhone) {
          res.status(409).json({
            status: 'error',
            message: 'Conflict',
            errors: { phone_number: 'Phone number is already registered.' },
          });
          return;
        }
      }
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insert into the database
    const insertResult = await query(
      `INSERT INTO users (full_name, email, phone_number, password, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, full_name, email, phone_number, role, created_at`,
      [full_name.trim(), normalizedEmail, normalizedPhone, hashedPassword, userRole]
    );

    const newUser = insertResult.rows[0];

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred during registration. Please try again later.',
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, phone_number, password } = req.body;

  const normalizedEmail = email ? email.toLowerCase().trim() : null;
  const normalizedPhone = phone_number ? phone_number.trim() : null;

  try {
    // 1. Find user by email or phone_number
    let userResult;
    if (normalizedEmail) {
      userResult = await query(
        'SELECT id, full_name, email, phone_number, password, role, created_at FROM users WHERE email = $1',
        [normalizedEmail]
      );
    } else if (normalizedPhone) {
      userResult = await query(
        'SELECT id, full_name, email, phone_number, password, role, created_at FROM users WHERE phone_number = $1',
        [normalizedPhone]
      );
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    if (userResult.rowCount === 0) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const user = userResult.rows[0];

    // 2. Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user.id, full_name: user.full_name, email: user.email, phone_number: user.phone_number, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Remove password hash from the response data
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred during login. Please try again later.',
    });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  // The user details are attached to req.user by authMiddleware
  res.status(200).json({
    status: 'success',
    data: {
      user: (req as any).user,
    },
  });
}

/**
 * Handle forgot password requests
 * Generates a 6-digit verification code and stores it in Redis with automatic expiration
 * Sends the verification code via email to the user
 */
export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  // Validate that email is provided
  if (!email) {
    res.status(400).json({
      status: 'error',
      message: 'Email is required',
    });
    return;
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email in the database
    const userResult = await query(
      'SELECT id, full_name, email FROM users WHERE email = $1',
      [normalizedEmail]
    );

    // Security: Don't reveal if email exists or not
    // This prevents email enumeration attacks
    if (userResult.rowCount === 0) {
      res.status(200).json({
        status: 'success',
        message: 'If the email exists, a verification code has been sent.',
      });
      return;
    }

    const user = userResult.rows[0];

    // Generate a random 6-digit verification code
    // Math.random() generates 0-1, multiply by 1000000 for 6 digits, floor to integer
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the verification code in Redis with 10 minutes expiration (600 seconds)
    // Redis will automatically delete the code after expiration
    // Key format: "reset_code:{email}" -> Value: verification code
    await storeVerificationCode(user.email, verificationCode, 600);

    // Send the verification code via email
    await sendPasswordResetEmail(user.email, verificationCode);

    // Return success message (same as if email didn't exist for security)
    res.status(200).json({
      status: 'success',
      message: 'If the email exists, a verification code has been sent.',
    });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}

/**
 * Handle password reset with a valid verification code
 * Validates the code from Redis and updates the user's password
 */
export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { email, code, new_password } = req.body;

  // Validate that email, code, and new password are provided
  if (!email || !code || !new_password) {
    res.status(400).json({
      status: 'error',
      message: 'Email, verification code, and new password are required',
    });
    return;
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Verify the code matches the stored code in Redis
    const isValidCode = await verifyResetCode(normalizedEmail, code);

    // Check if the code is valid
    if (!isValidCode) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification code',
      });
      return;
    }

    // Find the user by email to get their ID
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (userResult.rowCount === 0) {
      res.status(400).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    const user = userResult.rows[0];

    // Hash the new password using bcrypt
    // Salt rounds of 10 provides a good balance of security and performance
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);

    // Update the user's password in the database
    await query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, user.id]
    );

    // Delete the verification code from Redis to prevent reuse
    // This makes the code one-time use only
    await deleteVerificationCode(normalizedEmail);

    // Return success message
    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Error during reset password:', error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}
