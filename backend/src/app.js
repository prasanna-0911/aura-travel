const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const weaverRoutes = require('./routes/weaverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const syncRoutes = require('./routes/syncRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigin === '*' || origin === allowedOrigin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'Aura Travel API',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', catalogRoutes);
app.use('/api/weaver', weaverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
