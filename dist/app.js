"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logger middleware (basic custom logging)
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});
// Health check endpoint
app.get('/health', async (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Authentication service is healthy',
        timestamp: new Date().toISOString(),
    });
});
// Route mounting
app.use('/api/auth', auth_routes_1.default);
// 404 Route handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Resource not found: ${req.method} ${req.originalUrl}`,
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Exception:', err);
    // Handle express json parsing errors
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        res.status(400).json({
            status: 'error',
            message: 'Malformed JSON payload.',
        });
        return;
    }
    res.status(500).json({
        status: 'error',
        message: 'An internal server error occurred.',
    });
});
exports.default = app;
