// routes/userRoutes.js
import express from "express";
import { getAllUsers } from "../controllers/user2Controller.js";

const router = express.Router();

router.get("/", getAllUsers);

export default router;
