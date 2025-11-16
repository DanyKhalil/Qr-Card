import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { verifyEmail } from "../controllers/verifyController.js";


const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);


export default router;

