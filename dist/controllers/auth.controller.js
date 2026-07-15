"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
async function register(req, res) {
    const { username, email, password } = req.body;
    try {
        // 1. Check if user already exists (by email or username)
        const existingUserCheck = await (0, db_1.query)('SELECT id, username, email FROM users WHERE email = $1 OR username = $2', [email.toLowerCase(), username.toLowerCase()]);
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
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // 3. Insert into the database
        const insertResult = await (0, db_1.query)(`INSERT INTO users (username, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email, created_at`, [username.trim(), email.toLowerCase().trim(), hashedPassword]);
        const newUser = insertResult.rows[0];
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: newUser,
            },
        });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during registration. Please try again later.',
        });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    try {
        // 1. Find user by email
        const userResult = await (0, db_1.query)('SELECT id, username, email, password, created_at FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        if (userResult.rowCount === 0) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
            });
            return;
        }
        const user = userResult.rows[0];
        // 2. Compare passwords
        const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
            });
            return;
        }
        // 3. Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during login. Please try again later.',
        });
    }
}
async function getMe(req, res) {
    // The user details are attached to req.user by authMiddleware
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
        },
    });
}
