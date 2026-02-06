// controllers/subscriptionController.js
import { User, UserSubscription, SubscriptionPlan, Payment, Profile, Notification } from "../models/index.js";
import sequelize from "../config/db.js"
import { Op, fn, col, where } from "sequelize";

/**
 * Get current user's subscription
 * GET /subscription/current
 */
export const getCurrentSubscription = async (req, res) => {
  try {
    const { profile_id } = req.body; // Get profile_id from request body
    if (!profile_id) {
      return res.status(400).json({ error: "profile_id is required" });
    }

    const subscription = await UserSubscription.findOne({
      where: { profile_id }, // Use profile_id instead of user_id
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
    const { profile_id, plan_id, payment_details } = req.body;

    if (!profile_id) {
      return res.status(400).json({ error: "profile_id is required" });
    }

    const profile = await Profile.findByPk(profile_id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const plan = await SubscriptionPlan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Check if profile already has an active subscription
    const currentSub = await UserSubscription.findOne({
      where: {
        profile_id,
        status: "active",
        end_date: { [Op.gt]: new Date() }
      }
    });

    if (currentSub) {
      return res.status(400).json({ error: "Profile already has an active subscription" });
    }

    // Handle receipt upload
    let receiptUrl = null;
    if (req.files && req.files.length > 0) {
      const receiptFile = req.files.find(file => file.fieldname === "receipt");
      if (receiptFile) {
        receiptUrl = `/uploads/receipts/${receiptFile.filename}`;
      }
    }

    // 🧠 Calculate end_date based on billing_interval
    const startDate = new Date();
    let endDate = new Date(startDate);

    console.log(plan.billing_interval)

    switch (plan.billing_interval) {
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;

      case "lifetime":
        endDate.setFullYear(endDate.getFullYear() + 100);
        break;

      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }
    console.log(endDate)

    // Create new subscription
    const subscription = await UserSubscription.create({
      profile_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      status: "pending",
    });

    console.log(subscription)

    const details =
      typeof payment_details === "string"
        ? JSON.parse(payment_details)
        : payment_details;

    // Create initial pending payment
    const payment = await Payment.create({
      profile_id,
      subscription_id: subscription.id,
      amount: plan.price,
      currency: plan.currency,
      payment_method: details?.method || "manual",
      status: "pending",
      receipt_url: receiptUrl,
      notes: details?.notes || null
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
    const { profile_id } = req.body;

    if (!profile_id) {
      return res.status(400).json({ error: "profile_id is required" });
    }

    const subscription = await UserSubscription.findOne({
      where: { profile_id, status: "active" }
    });

    if (!subscription) {
      return res.status(404).json({ error: "No active subscription found for this profile" });
    }

    subscription.status = "cancelled";
    subscription.end_date = new Date();
    await subscription.save();

    res.json({
      message: "Subscription cancelled successfully",
      subscription
    });
  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    res.status(500).json({ error: error.message });
  }
};

















/**
 * Get all payments with user and subscription details (Admin only)
 * GET /subscription/payments
 * Query params: 
 *   - status: filter by payment status
 *   - payment_method: filter by payment method
 *   - start_date, end_date: date range filter
 *   - page, limit: pagination
 */
export const getAllPayments = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const {
      profile_id,
      status,
      payment_method,
      start_date,
      end_date,
      page = 1,
      limit = 20,
      search
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Base payment filters
    const paymentWhere = {};
    if (status) paymentWhere.status = status;
    if (payment_method) paymentWhere.payment_method = payment_method;
    if (start_date || end_date) {
      paymentWhere.created_at = {};
      if (start_date) paymentWhere.created_at[Op.gte] = new Date(start_date);
      if (end_date) paymentWhere.created_at[Op.lte] = new Date(end_date);
    }
    if (profile_id) paymentWhere.profile_id = profile_id;

    // Build include for Profile -> User
    const profileInclude = {
      model: Profile,
      as: 'profile',
      attributes: ['id', 'name', 'profile_pic_url', 'phone_number', 'bio', 'headline', 'website'],
      required: search ? true : false, // **required for JOIN filtering**
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'verified', 'is_active', 'created_at'],
          required: search ? true : false // required for filtering on email
        }
      ]
    };

    // Add search filter if needed
    const whereSearch = {};
    if (search) {
      whereSearch[Op.or] = [
        { '$profile.name$': { [Op.like]: `%${search}%` } },
        { '$profile.user.email$': { [Op.like]: `%${search}%` } }
      ];
    }

    // Query with pagination
    const { count, rows } = await Payment.findAndCountAll({
      where: { ...paymentWhere, ...whereSearch },
      include: [
        profileInclude,
        {
          model: UserSubscription,
          as: 'subscription',
          attributes: [
            'id', 'status', 'start_date', 'end_date', 'next_billing_date',
            'auto_renew', 'notes', 'created_at'
          ],
          include: [
            {
              model: SubscriptionPlan,
              as: 'plan',
              attributes: ['id', 'name', 'price', 'currency', 'billing_interval']
            }
          ]
        },
        {
          model: User,
          as: 'approved_by_admin',
          attributes: ['id', 'email'],
          required: false
        }
      ],
      attributes: [
        'id', 'amount', 'currency', 'payment_method', 'status',
        'transaction_reference', 'receipt_url', 'paid_at', 
        'approved_at', 'notes', 'created_at', 'updated_at'
      ],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset
    });

    // Format payments
    const formattedPayments = rows.map(payment => {
      const p = payment.toJSON();
      if (p.status === 'pending' && p.created_at) {
        const createdDate = new Date(p.created_at);
        p.days_pending = Math.ceil((new Date() - createdDate) / (1000 * 60 * 60 * 24));
      }
      p.formatted_created_at = p.created_at ? new Date(p.created_at).toLocaleString() : null;
      p.formatted_paid_at = p.paid_at ? new Date(p.paid_at).toLocaleString() : null;
      p.formatted_approved_at = p.approved_at ? new Date(p.approved_at).toLocaleString() : null;
      return p;
    });

    // Summary stats (ignoring search)
    const summary = {
      total: count,
      pending: await Payment.count({ where: { ...paymentWhere, status: 'pending' } }),
      completed: await Payment.count({ where: { ...paymentWhere, status: 'completed' } }),
      failed: await Payment.count({ where: { ...paymentWhere, status: 'failed' } }),
      refunded: await Payment.count({ where: { ...paymentWhere, status: 'refunded' } }),
      total_amount: {
        all: await Payment.sum('amount', { where: paymentWhere }),
        completed: await Payment.sum('amount', { where: { ...paymentWhere, status: 'completed' } }),
        pending: await Payment.sum('amount', { where: { ...paymentWhere, status: 'pending' } })
      }
    };

    res.json({
      success: true,
      payments: formattedPayments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum),
        hasNext: pageNum < Math.ceil(count / limitNum),
        hasPrev: pageNum > 1
      },
      summary,
      filters: { status, payment_method, start_date, end_date, profile_id, search }
    });

  } catch (error) {
    console.error("Error in getAllPayments:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


/**
 * Update payment status (Admin only)
 * PATCH /subscription/payments/:paymentId
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const { paymentId } = req.params;
    const { status, notes } = req.body;

    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const adminUser = await User.findByPk(adminId, {
      include: [
        {
          model: Profile,
          as: "profiles",
          attributes: ["id", "name"]
        }
      ]
    });

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const adminProfileId =
      adminUser.profiles?.length > 0 ? adminUser.profiles[0].id : null;

    // Fetch payment
    const payment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["id", "name"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email"]
            }
          ]
        },
        {
          model: UserSubscription,
          as: "subscription",
          include: [
            {
              model: SubscriptionPlan,
              as: "plan",
              attributes: ["name"]
            }
          ]
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const oldStatus = payment.status;
    const updateData = {};

    if (status) {
      if (!["pending", "completed", "failed", "refunded"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    let notificationMessage = "";
    let notificationType = "";
    let notificationTitle = "";

    // Payment approved → activate subscription
    if (status === "completed") {
      updateData.approved_at = new Date();
      updateData.approved_by = adminId;

      if (payment.subscription) {
        const subscription = await UserSubscription.findByPk(payment.subscription.id, {
          include: [{ model: SubscriptionPlan, as: "plan" }]
        });

        if (!subscription) throw new Error("Subscription not found");

        const startDate = new Date();
        let endDate = new Date(startDate);

        switch (subscription.plan.billing_interval) {
          case "monthly":
            endDate.setMonth(endDate.getMonth() + 1);
            break;
          case "yearly":
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
          case "lifetime":
            endDate.setFullYear(endDate.getFullYear() + 100);
            break;
          default:
            endDate.setMonth(endDate.getMonth() + 1);
        }

        await subscription.update({
          status: "active",
          start_date: startDate,
          end_date: endDate
        });
      }

      notificationType = "payment_approved";
      notificationTitle = "Payment Approved";
      notificationMessage = `Your payment of $${payment.amount} for ${
        payment.subscription?.plan?.name || "subscription"
      } has been approved.`;
    }


    if (status === "failed" && payment.subscription) {
      await UserSubscription.update(
        { status: "cancelled" },
        { where: { id: payment.subscription.id } }
      );

      notificationType = "payment_rejected";
      notificationTitle = "Payment Rejected";
      notificationMessage = `Your payment of $${payment.amount} has been rejected.`;
    }

    if (status === "refunded" && payment.subscription) {
      await UserSubscription.update(
        { status: "cancelled" },
        { where: { id: payment.subscription.id } }
      );

      notificationType = "payment_refunded";
      notificationTitle = "Payment Refunded";
      notificationMessage = `Your payment of $${payment.amount} has been refunded.`;
    }

    await Payment.update(updateData, { where: { id: paymentId } });

    // ✅ Notification now uses PROFILE name + sender_profile_id
    if (status && status !== oldStatus && payment.profile?.user && notificationType) {
      await Notification.create({
        receiver_profile_id: payment.profile.id,
        sender_profile_id: adminProfileId,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        metadata: {
          payment_id: paymentId,
          amount: payment.amount,
          currency: payment.currency,
          subscription_id: payment.subscription?.id,
          plan_name: payment.subscription?.plan?.name,
          old_status: oldStatus,
          new_status: status
        },
        action_url: status === "completed" ? "/profile" : "/subscribe",
        action_label: status === "completed" ? "Go to Profile" : "View Plans",
        is_read: false,
        is_sent: false,
        is_seen: false
      });
    }

    const updatedPayment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["id", "name"],
          include: [{ model: User, as: "user", attributes: ["id", "email"] }]
        },
        {
          model: UserSubscription,
          as: "subscription",
          include: [{ model: SubscriptionPlan, as: "plan" }]
        }
      ]
    });

    res.json({
      success: true,
      message: "Payment updated successfully",
      payment: updatedPayment,
      notification_sent: !!notificationType
    });

  } catch (error) {
    console.error("DEBUG: Error in updatePaymentStatus:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * Get payment statistics (Admin only)
 * GET /subscription/payments/stats
 */
export const getPaymentStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is admin
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Get stats for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total revenue
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    });

    // Monthly revenue
    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        created_at: { $gte: thirtyDaysAgo }
      }
    });

    // Payment method distribution
    const paymentMethodStats = await Payment.findAll({
      attributes: [
        'payment_method',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      where: { status: 'completed' },
      group: ['payment_method'],
      raw: true
    });

    // Daily revenue for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      where: {
        status: 'completed',
        created_at: { $gte: sevenDaysAgo }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Pending payments needing attention
    const pendingPayments = await Payment.count({
      where: { status: 'pending' }
    });

    // Active subscriptions
    const today = new Date();

    const activeSubscriptions = await UserSubscription.count({
      where: {
        status: {
          [Op.ne]: 'pending' // exclude pending
        },
        end_date: {
          [Op.gt]: today // end date in the future
        }
      }
    });

    res.json({
      success: true,
      stats: {
        total_revenue: totalRevenue || 0,
        monthly_revenue: monthlyRevenue || 0,
        payment_methods: paymentMethodStats,
        daily_revenue: dailyRevenue,
        pending_payments: pendingPayments,
        active_subscriptions: activeSubscriptions
      }
    });

  } catch (error) {
    console.error("Error in getPaymentStats:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};