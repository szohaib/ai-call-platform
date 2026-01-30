const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase before routes
require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON parsing for all other routes
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Call Platform API is running',
    features: ['auth', 'credits', 'payments', 'calls']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📞 API Version: 2.0 (with Auth & Credits)`);
});
