const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/calls', require('./routes/calls'));
app.use('/api/templates', require('./routes/templates'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Call Platform API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
