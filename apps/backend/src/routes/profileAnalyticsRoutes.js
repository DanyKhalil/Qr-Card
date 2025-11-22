import express from "express";
import { getUserProfileAnalytics, createProfileVisit } from "../controllers/profileAnalyticsController.js";
import { authenticateOptional } from "../middleware/authMiddleware.js";

const router = express.Router(); // here we are creating a new router for the user 

router.route("/:id")
    .get(getUserProfileAnalytics)
    .post(
            authenticateOptional, 
            createProfileVisit
    );

export default router;