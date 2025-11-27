const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const path = require('path');
const fs = require('fs');

// -------------------------------------------------
// 1. GET the whole settings object (includes logo base64)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// -------------------------------------------------
// 2. GET **only** the logo image (served as base64)
router.get('/logo', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (settings?.logo) {
      // base64 string already stored → send it
      res.json({ logo: settings.logo });
    } else {
      // fallback: serve the file from /public/logo.png
      const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        const buffer = fs.readFileSync(logoPath);
        const base64 = `data:image/png;base64,${buffer.toString('base64')}`;
        res.json({ logo: base64 });
      } else {
        res.status(404).json({ message: 'Logo not found' });
      }
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;