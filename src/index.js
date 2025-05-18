const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Microservices DevOps Project',
    version: '1.0.0',
    author: 'DevOps Team',
    description: 'CI/CD Pipeline with Jenkins'
  });
});

// Auth routes (no authentication required)
app.use('/api/auth', require('./routes/auth'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'POST /api/auth/logout'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server (only in non-test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;