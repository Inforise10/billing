const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ---- static folder (so /logo.png works directly) ----
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/quotations', require('./routes/quotations'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/settings', require('./routes/settings'));

// Example API route
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// -------------------------------------------------
// Serve static frontend build - CORRECTED PATH
// Build files are in /dist (same level as backend folder)
const buildPath = path.join(__dirname, '..', 'dist');

// Check if build directory exists
if (fs.existsSync(buildPath)) {
  console.log('Build directory found at:', buildPath);
  app.use(express.static(buildPath));
  
  // Serve React app for all other routes
  app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Frontend build not found' });
    }
  });
} else {
  console.log('Build directory not found at:', buildPath);
  // Fallback for development or if build fails
  app.get('*', (req, res) => {
    res.json({ 
      message: 'Backend is running, but frontend build not found',
      buildPath: buildPath 
    });
  });
}

// -------------------------------------------------
// Seed logo on server start (idempotent)
const seedLogo = async () => {
  try {
    const Settings = require('./models/Settings');
    const logoPath = path.join(__dirname, 'public', 'logo.png');

    if (!fs.existsSync(logoPath)) {
      console.warn('Warning: logo.png not found in /public – skipping seed');
      return;
    }

    const existing = await Settings.findOne();
    if (existing?.logo) {
      // already seeded
      return;
    }

    const buffer = fs.readFileSync(logoPath);
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

    if (existing) {
      existing.logo = base64;
      await existing.save();
    } else {
      await Settings.create({ logo: base64 });
    }
    console.log('Logo seeded into Settings collection');
  } catch (error) {
    console.error('Error seeding logo:', error);
  }
};

// -------------------------------------------------
// MongoDB connection
mongoose.connect(
  process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/billing_system',
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  }
)
.then(() => {
  console.log('MongoDB Connected');
  seedLogo(); // Run logo seeding once
})
.catch(err => console.error('MongoDB error:', err));

// Test route
app.get('/api/test', (req, res) => res.json({ message: 'Backend OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));