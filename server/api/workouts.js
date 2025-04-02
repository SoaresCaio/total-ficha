// server/api/workouts.js
const express = require('express');
const serverless = require('serverless-http'); // Wraps express for Vercel
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase initialization (same logic from your index.js)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Sample route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working from Vercel!' });
});

// Your other routes (copy over from your current code)
// e.g., GET workouts, POST workouts, DELETE workouts, etc.

module.exports = serverless(app);
