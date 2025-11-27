const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

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


// example API route
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// -------------------------------------------------
// Serve static frontend build **UPDATED**
// Your build output is in /dist (root folder)
const buildPath = path.join(__dirname, '..', 'dist');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// -------------------------------------------------
// 5. **Seed logo on server start** (idempotent)
const seedLogo = async () => {
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
};

// -------------------------------------------------
mongoose.connect(
  process.env.MONGODB_URL || 'mongodb://localhost:27017/billing_system',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log('MongoDB Connected');
  seedLogo();                 // <-- run once
})
.catch(err => console.error('MongoDB error:', err));

app.get('/api/test', (req, res) => res.json({ message: 'Backend OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
