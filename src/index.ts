import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import db from './database/sqlite';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use(config.api.prefix, routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'GearGuard Maintenance Management API',
    version: '1.0.0',
    endpoints: {
      health: `${config.api.prefix}/health`,
      departments: `${config.api.prefix}/departments`,
      employees: `${config.api.prefix}/employees`,
      teams: `${config.api.prefix}/teams`,
      equipment: `${config.api.prefix}/equipment`,
      requests: `${config.api.prefix}/requests`,
      dashboard: `${config.api.prefix}/dashboard/stats`
    }
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

const startServer = async () => {
  try {
    // Test database connection
    db.prepare('SELECT 1').get();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API available at http://localhost:${PORT}${config.api.prefix}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server...');
  db.close();
  console.log('Database closed');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, closing server...');
  db.close();
  console.log('Database closed');
  process.exit(0);
});

export default app;
