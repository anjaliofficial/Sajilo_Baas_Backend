import express from 'express';
import userRoutes from './routes/user.routes'

const app = express();
app.use(express.json());

// user authentication routes
app.use("/api/auth", userRoutes);

export default app;