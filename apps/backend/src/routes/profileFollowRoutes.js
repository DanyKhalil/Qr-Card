import express from "express";
import { 
  followUser, 
  unfollowUser, 
  getUserFollowStatus 
} from "../controllers/profileFollowController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /follow - make one user follow another
router.post("/", authenticate, followUser);

// DELETE /follow - unfollow a user
router.delete("/", authenticate, unfollowUser);

// GET /follow/:userId - get user's followers and following
router.get("/:profileId", authenticate, getUserFollowStatus);

export default router;