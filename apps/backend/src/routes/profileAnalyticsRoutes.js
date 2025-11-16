import express from "express";
import { getUserProfileAnalytics, createProfileVisit } from "../controllers/profileAnalyticsController.js";

const router = express.Router(); // here we are creating a new router for the user 

router.route("/:id")
    .get(getUserProfileAnalytics)
    .post(
            // authenticateToken // authentication middleware that sets userId, 
            createProfileVisit
    );

export default router;