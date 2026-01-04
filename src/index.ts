import express from "express";
import { connectToDatabase } from "./database/mongodb";
import userRoutes from "./routes/user.routes";
import { PORT } from "./config/index"; // Correct path

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
