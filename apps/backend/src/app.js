import express from "express";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

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


if (app._router) {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // routes registered directly on app
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // router middleware
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