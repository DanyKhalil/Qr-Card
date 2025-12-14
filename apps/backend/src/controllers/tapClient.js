// src/tapClient.js
import fetch from 'node-fetch';

const TAP_SECRET_KEY = process.env.TAP_SECRET_KEY;

export const createTapCharge = async ({ amount, currency, description, metadata, email, redirectUrl }) => {
  try {
    const response = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TAP_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        threeDSecure: true,
        description,
        statement_descriptor: 'QrCardApp',
        metadata,

        // IMPORTANT FIX: add first_name because TAP requires it
        customer: {
          first_name: "User",
          email: email
        },

        // IMPORTANT FIX: make redirect URL valid
        redirect: {
          url: `${redirectUrl}?tap_id={tap_id}`
        },

        // PAYMENT METHOD
        source: {
          id: "src_all"
        }
      })
    });

    const data = await response.json();
    return data;

  } catch (err) {
    console.error('TAP client error:', err);
    throw new Error('Failed to create TAP charge');
  }
};
