import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ message: "API running 🚀" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
