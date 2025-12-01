import express from "express";
import { followUser, unfollowUser } from "../controllers/profileFollowController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /follow - make one user follow another
router.post("/", authenticate, followUser);

// DELETE /follow - unfollow a user
router.delete("/", authenticate, unfollowUser);

export default router;
