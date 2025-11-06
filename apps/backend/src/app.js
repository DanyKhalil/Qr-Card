import express from "express";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";
import profileAnalyticsRoutes from "./routes/profileAnalyticsRoutes.js"
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// this so the default folder will be the one with images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile-analytics", profileAnalyticsRoutes)

export default app;