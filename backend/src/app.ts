import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Analysis-specific rate limiting (more restrictive)
const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 analysis requests per minute
  message: {
    error: 'Too many analysis requests, please wait before trying again.'
  }
});

// CORS configuration - Updated to include actual Vercel domains
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://performative-ai-p4si-34u5fy905-spoofyy-1s-projects.vercel.app',
        'https://performative-ai-p4si-lkw5u4bqc-spoofyy-1s-projects.vercel.app',
        'https://*.vercel.app',
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*-spoofyy-1s-projects\.vercel\.app$/
      ]
    : [
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Model-Type']
};

app.use(cors(corsOptions));
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/analyze', analysisLimiter, analyzeRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Matcha.AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      analyze: '/api/analyze'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// Start server
const port = parseInt(PORT as string) || 8000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Matcha.AI Backend running on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://0.0.0.0:${port}/health`);
}); 