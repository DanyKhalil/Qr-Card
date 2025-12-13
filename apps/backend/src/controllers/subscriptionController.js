// src/controllers/subscriptionController.js
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from '../models/subscription.js';
import { createTapCharge } from './tapClient.js';

export const createSubscription = async (req, res) => {
  try {
    const { userId, planName, price, email } = req.body;

    if (!userId || !planName || !price || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // IMPORTANT: This must be your frontend URL
    const redirectUrl = `${process.env.FRONTEND_URL}/subscription-success`;

    // Create TAP charge
    const tapResponse = await createTapCharge({
      amount: price,
      currency: 'USD',
      description: `Subscription for ${planName}`,
      metadata: { userId, planName },
      email,
      redirectUrl
    });

    if (!tapResponse.id || !tapResponse.transaction) {
      console.error('Invalid TAP response:', tapResponse);
      return res.status(500).json({ error: 'Failed to create TAP charge' });
    }

    // Save subscription as pending
    const subscription = await Subscription.create({
      id: uuidv4(),
      user_id: userId,
      plan_name: planName,
      price,
      start_date: new Date(),
      end_date: null,
      status: 'pending',
      tap_charge_id: tapResponse.id
    });

    res.json({
      chargeUrl: tapResponse.transaction.url,
      subscriptionId: subscription.id
    });

  } catch (err) {
    console.error('createSubscription error:', err);
    res.status(500).json({ error: err.message || 'Failed to create subscription' });
  }
};

// Webhook to update status
export const tapWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === 'charge.success') {
      const charge = event.data;

      const subscription = await Subscription.findOne({ where: { tap_charge_id: charge.id } });
      if (subscription) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await subscription.update({
          status: 'active',
          start_date: startDate,
          end_date: endDate
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook failed' });
  }
};

// Check subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({
      where: { user_id: userId, status: 'active' }
    });

    if (subscription) {
      res.json({ status: 'active', plan: subscription.plan_name });
    } else {
      res.json({ status: 'inactive' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error' });
  }
};
