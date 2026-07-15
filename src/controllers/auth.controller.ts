import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists (by email or username)
    const existingUserCheck = await query(
      'SELECT id, username, email FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username.toLowerCase()]
    );

    if (existingUserCheck.rowCount && existingUserCheck.rowCount > 0) {
      const existingUser = existingUserCheck.rows[0];
      if (existingUser.email === email.toLowerCase()) {
        res.status(409).json({
          status: 'error',
          message: 'Conflict',
          errors: { email: 'Email is already registered.' },
        });
        return;
      }
      if (existingUser.username === username.toLowerCase()) {
        res.status(409).json({
          status: 'error',
          message: 'Conflict',
          errors: { username: 'Username is already taken.' },
        });
        return;
      }
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insert into the database
    const insertResult = await query(
      `INSERT INTO users (username, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email, created_at`,
      [username.trim(), email.toLowerCase().trim(), hashedPassword]
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
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const userResult = await query(
      'SELECT id, username, email, password, created_at FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

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
      { id: user.id, username: user.username, email: user.email },
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
