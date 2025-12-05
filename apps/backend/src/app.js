import express from "express";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import profileAnalyticsRoutes from "./routes/profileAnalyticsRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import user2Routes from "./routes/user2Routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import adminUsersRoutes from './routes/adminUsers.js';
import profileFollowRoutes from "./routes/profileFollowRoutes.js";

const app = express();

// this so the default folder will be the one with images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

app.use(corsMiddleware);

app.use('/uploads', corsMiddleware, express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users2", user2Routes);
app.use("/api/profile-analytics", profileAnalyticsRoutes)
app.use("/api/users3", adminUsersRoutes);
app.use("/api/follow", profileFollowRoutes);

app.get('/api/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

if (app._router) {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          console.log(`${Object.keys(route.methods)} ${route.path}`);
        }
      });
    }
  });
}

export default app;