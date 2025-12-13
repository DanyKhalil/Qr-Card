// routes/userRoutes.js
import express from "express";
import { getFollowersAndFollowing } from "../controllers/user2Controller.js";

const router = express.Router();

router.get("/follow", getFollowersAndFollowing);

export default router;
