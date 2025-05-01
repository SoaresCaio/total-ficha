// server/api/workouts.js
const express = require('express');
const serverless = require('serverless-http');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin if not already initialized
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

// GET endpoint to fetch workouts
app.get('/workouts/:code', async (req, res) => {
  const code = req.params.code;
  try {
    const docRef = db.collection('workouts').doc(code);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(doc.data());
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to save a workout
app.post('/workouts', async (req, res) => {
  const { code, workoutName, exercises } = req.body;
  if (!code || !workoutName || !exercises) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const docRef = db.collection('workouts').doc(code);
    const doc = await docRef.get();
    let existingWorkouts = {};
    if (doc.exists) {
      existingWorkouts = doc.data().workouts || {};
    }
    existingWorkouts[workoutName] = { exercises };
    await docRef.set({ workouts: existingWorkouts });
    res.json({ message: 'Workout saved successfully' });
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE endpoint to delete a workout
app.delete('/workouts/:code/:workoutName', async (req, res) => {
  const { code, workoutName } = req.params;
  try {
    const docRef = db.collection('workouts').doc(code);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    const existingWorkouts = doc.data().workouts || {};
    if (!existingWorkouts[workoutName]) {
      return res.status(404).json({ error: 'Specified workout not found' });
    }
    delete existingWorkouts[workoutName];
    await docRef.set({ workouts: existingWorkouts });
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// A simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'API is working from Vercel!' });
});

// Export as a serverless function
module.exports = serverless(app);
