// src/pages/SubscribePage.jsx
import React, { useState, useEffect } from 'react';

const SubscribePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user from localStorage (or replace with your auth logic)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      setError('User not logged in.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5050/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planName: 'Pro',  // example plan
          price: 1,        // example price
          email: user.email
        })
      });

      // Read raw text first for debugging
      const text = await res.text();
      console.log('Backend response:', text);

      // Parse JSON safely
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Invalid JSON response from backend');
      }

      if (!data.chargeUrl) {
        throw new Error('No charge URL returned from backend');
      }

      // Redirect to TAP payment page
      window.location.href = data.chargeUrl;

    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Subscribe to Pro Plan</h2>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SubscribePage;
