import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger middleware (basic custom logging)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Authentication service is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Route mounting
app.use('/api/auth', authRoutes);

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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

export default app;
