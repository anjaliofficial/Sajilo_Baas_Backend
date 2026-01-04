import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectToDatabase } from "./database-mongodb"; // adjust if file is named differently
import userRoutes from "./routes/user.routes";
import { PORT } from "../config/index";

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("Connected to MongoDB successfully.");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
