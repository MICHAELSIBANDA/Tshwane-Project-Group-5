import { Request, Response, NextFunction } from 'express';

// Simple regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { username, email, password } = req.body;
  const errors: { [key: string]: string } = {};

  // Validate username
  if (!username || typeof username !== 'string') {
    errors.username = 'Username is required and must be a string.';
  } else if (username.trim().length < 3 || username.trim().length > 50) {
    errors.username = 'Username must be between 3 and 50 characters.';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.username = 'Username can only contain alphanumeric characters, underscores, and hyphens.';
  }

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required and must be a string.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required and must be a string.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;
  const errors: { [key: string]: string } = {};

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
}
