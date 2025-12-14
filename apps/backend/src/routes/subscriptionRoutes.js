// src/routes/subscriptionRoutes.js
import express from 'express';
import { createSubscription, tapWebhook, getSubscriptionStatus } from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/create', createSubscription);
router.post('/tap-webhook', tapWebhook);
router.get('/:userId/status', getSubscriptionStatus);

export default router;
