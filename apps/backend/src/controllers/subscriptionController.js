// controllers/subscriptionController.js
import { User, UserSubscription, SubscriptionPlan, Payment } from "../models/index.js";

/**
 * Get current user's subscription
 * GET /subscription/current
 */
export const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming auth middleware sets req.user
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const subscription = await UserSubscription.findOne({
      where: { user_id: userId },
      include: [
        {
          model: SubscriptionPlan,
          as: "plan",
        }
      ]
    });

    if (!subscription) {
      return res.json({ subscription: null });
    }

    res.json({ subscription });
  } catch (error) {
    console.error("Error in getCurrentSubscription:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all available subscription plans
 * GET /subscription/plans
 */
export const getAvailablePlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      order: [["price", "ASC"]]
    });
    res.json({ plans });
  } catch (error) {
    console.error("Error in getAvailablePlans:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Subscribe to a plan
 * POST /subscription/subscribe
 * body: { plan_id, payment_details }
 */
export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { plan_id, payment_details } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const plan = await SubscriptionPlan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Check if user already has an active subscription
    const currentSub = await UserSubscription.findOne({
      where: { user_id: userId, status: "active" }
    });

    if (currentSub) {
      return res.status(400).json({ error: "User already has an active subscription" });
    }

    // Check for uploaded receipt if payment method requires it
    let receiptUrl = null;
    if (req.files && req.files.length > 0) {
      const receiptFile = req.files.find(file => file.fieldname === 'receipt');
      if (receiptFile) {
        // Save receipt URL to payment
        receiptUrl = `/uploads/receipts/${receiptFile.filename}`;
      }
    }

    // Create new subscription
    const subscription = await UserSubscription.create({
      user_id: userId,
      plan_id,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30*24*60*60*1000), // Example: 30 days
      status: "pending", // start as pending until payment is confirmed
    });

    // Create initial pending payment
    const payment = await Payment.create({
      user_id: userId,
      subscription_id: subscription.id,
      amount: plan.price,
      currency: plan.currency,
      payment_method: payment_details?.method || "manual", // default to manual
      status: "pending",
      receipt_url: receiptUrl, // ADD THIS LINE - was missing
      notes: payment_details?.notes || null
    });

    res.status(201).json({ 
      message: "Subscription created successfully. Payment is pending approval.", 
      subscription, 
      payment 
    });
  } catch (error) {
    console.error("Error in subscribeToPlan:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Cancel current subscription
 * POST /subscription/cancel
 */
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const subscription = await UserSubscription.findOne({
      where: { user_id: userId, is_active: true }
    });

    if (!subscription) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    subscription.is_active = false;
    subscription.status = "cancelled";
    subscription.end_date = new Date();
    await subscription.save();

    res.json({ message: "UserSubscription cancelled successfully", subscription });
  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    res.status(500).json({ error: error.message });
  }
};
