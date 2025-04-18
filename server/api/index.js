const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serverless = require("serverless-http");

const app = express();

// Enable CORS for the frontend
app.use(cors({ origin: "https://total-ficha.vercel.app" }));
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require("../serviceAccountKey.json");
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  process.exit(1);
}
const db = admin.firestore();

// Test Firestore connection
async function testFirestore() {
  try {
    await db.collection("test").doc("connection").set({ connected: true });
    console.log("Firestore connection test successful");
  } catch (error) {
    console.error("Firestore connection test failed:", error);
  }
}
testFirestore();

// POST endpoint to save workouts
app.post("/workouts", async (req, res) => {
  const { code, workoutName, exercises } = req.body;
  if (!code || !workoutName || !exercises) {
    return res
      .status(400)
      .json({ error: "Missing code, workoutName, or exercises" });
  }
  try {
    const normalizedCode = code.toLowerCase();
    await db
      .collection("workouts")
      .doc(normalizedCode)
      .set(
        {
          workouts: {
            [workoutName]: { exercises },
          },
        },
        { merge: true }
      );
    console.log(`Workout ${workoutName} saved for code: ${normalizedCode}`);
    res.status(200).json({ message: "Workout saved" });
  } catch (error) {
    console.error("Error saving workout:", error);
    res.status(500).json({ error: error.message || "Failed to save" });
  }
});

// GET endpoint to fetch all workouts for a code
app.get("/workouts/:code", async (req, res) => {
  const { code } = req.params;
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }
  try {
    const normalizedCode = code.toLowerCase();
    const doc = await db.collection("workouts").doc(normalizedCode).get();
    if (doc.exists) {
      const data = doc.data();
      console.log(`Workouts fetched for code: ${normalizedCode}`);
      res.status(200).json({ workouts: data.workouts || {} });
    } else {
      console.log(`No workouts found for code: ${normalizedCode}`);
      res.status(404).json({ error: "Workouts not found" });
    }
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ error: error.message || "Failed to fetch" });
  }
});

// DELETE endpoint to remove a specific workout
app.delete("/workouts/:code/:workoutName", async (req, res) => {
  const { code, workoutName } = req.params;
  if (!code || !workoutName) {
    return res.status(400).json({ error: "Missing code or workoutName" });
  }
  try {
    const normalizedCode = code.toLowerCase();
    await db
      .collection("workouts")
      .doc(normalizedCode)
      .update({
        [`workouts.${workoutName}`]: admin.firestore.FieldValue.delete(),
      });
    console.log(`Workout ${workoutName} deleted for code: ${normalizedCode}`);
    res.status(200).json({ message: "Workout deleted" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ error: error.message || "Failed to delete" });
  }
});

// Export the app wrapped with serverless-http
module.exports.handler = serverless(app);