import { Request, Response, NextFunction } from 'express';

// Simple regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple regex for phone number validation (digits, optional leading +, 7-15 digits)
const phoneRegex = /^\+?[0-9]{7,15}$/;

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { full_name, email, phone_number, password } = req.body;
  const errors: { [key: string]: string } = {};

  // Validate full_name
  if (!full_name || typeof full_name !== 'string') {
    errors.full_name = 'Full name is required and must be a string.';
  } else if (full_name.trim().length < 2 || full_name.trim().length > 100) {
    errors.full_name = 'Full name must be between 2 and 100 characters.';
  }

  // Validate email (optional if phone_number is provided)
  if (email && typeof email === 'string') {
    if (!emailRegex.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  // Validate phone_number (optional if email is provided)
  if (phone_number && typeof phone_number === 'string') {
    if (!phoneRegex.test(phone_number.replace(/[\s\-()]/g, ''))) {
      errors.phone_number = 'Please provide a valid phone number.';
    }
  }

  // At least one of email or phone_number is required
  if ((!email || typeof email !== 'string' || !email.trim()) && (!phone_number || typeof phone_number !== 'string' || !phone_number.trim())) {
    errors.email = 'At least one of email or phone number is required.';
    errors.phone_number = 'At least one of email or phone number is required.';
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
  const { email, phone_number, password } = req.body;
  const errors: { [key: string]: string } = {};

  // Validate email or phone_number (at least one required)
  if (email && typeof email === 'string') {
    if (!emailRegex.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  if (phone_number && typeof phone_number === 'string') {
    if (!phoneRegex.test(phone_number.replace(/[\s\-()]/g, ''))) {
      errors.phone_number = 'Please provide a valid phone number.';
    }
  }

  if ((!email || typeof email !== 'string' || !email.trim()) && (!phone_number || typeof phone_number !== 'string' || !phone_number.trim())) {
    errors.email = 'Email or phone number is required.';
    errors.phone_number = 'Email or phone number is required.';
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
