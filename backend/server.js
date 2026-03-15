/**
 * PlantScan Backend - Main Server Entry Point
 * Sets up Express server with middleware, routes, and error handling
 */

const dotenv = require('dotenv');
// Load environment variables from .env file BEFORE any other imports that might use them
dotenv.config();

const express = require('express');
const cors = require('cors');
const plantRoutes = require('./src/routes/plant');
const historyRoutes = require('./src/routes/history');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────

// Enable CORS so the frontend can communicate with this server
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check endpoint - useful for verifying the server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PlantScan backend is running!', timestamp: new Date().toISOString() });
});

// Plant identification routes (scan, identify)
app.use('/api/plant', plantRoutes);

// Scan history routes (list, delete)
app.use('/api/history', historyRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🌿 PlantScan backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
