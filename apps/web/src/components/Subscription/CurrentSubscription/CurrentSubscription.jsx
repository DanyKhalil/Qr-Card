import React, { useState, useEffect } from "react";
import './CurrentSubscription.css';

const CurrentSubscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load subscription from localStorage
        const loadSubscription = () => {
            try {
                const subscriptionStr = localStorage.getItem('subscription');
                if (subscriptionStr) {
                    const subscriptionData = JSON.parse(subscriptionStr);
                    setSubscription(subscriptionData);
                } else {
                    setSubscription(null);
                }
            } catch (error) {
                console.error("Error parsing subscription from localStorage:", error);
                setSubscription(null);
            } finally {
                setLoading(false);
            }
        };

        loadSubscription();

        // Listen for storage changes (in case subscription is updated elsewhere)
        const handleStorageChange = (e) => {
            if (e.key === 'subscription') {
                loadSubscription();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Optional: Custom event listener for subscription updates
        window.addEventListener('subscriptionUpdated', loadSubscription);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('subscriptionUpdated', loadSubscription);
        };
    }, []);

    // Refresh subscription from API
    const refreshSubscription = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5050/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.subscription) {
                    localStorage.setItem('subscription', JSON.stringify(data.subscription));
                    setSubscription(data.subscription);
                    // Trigger custom event for other components
                    window.dispatchEvent(new Event('subscriptionUpdated'));
                }
            }
        } catch (error) {
            console.error("Error refreshing subscription:", error);
        }
    };

    if (loading) {
        return (
            <div className="current-subscription loading">
                <h2>Loading Subscription...</h2>
                <p>Please wait while we load your subscription details.</p>
            </div>
        );
    }

    if (!subscription || !subscription.plan_name) {
        return (
            <div className="current-subscription no-subscription">
                <h2>No Active Subscription</h2>
                <p>You currently do not have an active subscription plan.</p>
                {/* <button 
                    className="refresh-btn"
                    onClick={refreshSubscription}
                    title="Refresh subscription status"
                >
                    🔄 Refresh Status
                </button> */}
            </div>
        );
    }

    const { plan_name, starts_at, expires_at, status, is_active } = subscription;

    // Format dates
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status display text
    const getStatusText = (status) => {
        const statusMap = {
            'active': 'Active',
            'pending': 'Pending Approval',
            'expired': 'Expired',
            'cancelled': 'Cancelled',
            'suspended': 'Suspended'
        };
        return statusMap[status] || status;
    };

    return (
        <div className={`current-subscription ${status}`}>
            <div className="subscription-header">
                <h2>{plan_name}</h2>
                {/* <button 
                    className="refresh-btn small"
                    onClick={refreshSubscription}
                    title="Refresh subscription status"
                >
                    🔄
                </button> */}
            </div>
            
            <div className="status-badge">
                Status: <strong>{getStatusText(status)}</strong>
                {is_active && <span className="active-indicator"> ● Active</span>}
            </div>
            
            {starts_at && (
                <div className="subscription-detail">
                    <span className="detail-label">Started:</span>
                    <span className="detail-value">{formatDate(starts_at)}</span>
                </div>
            )}
            
            {expires_at && (
                <div className="subscription-detail">
                    <span className="detail-label">Expires:</span>
                    <span className="detail-value">{formatDate(expires_at)}</span>
                </div>
            )}
            
            {/* Show warning if subscription is about to expire */}
            {expires_at && status === 'active' && new Date(expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                <div className="expiry-warning">
                    ⚠️ Your subscription expires soon!
                </div>
            )}
            
            {/* Action button based on status */}
            {!is_active && status !== 'pending' && (
                <button 
                    className="action-btn"
                    onClick={() => window.location.href = '/subscribe'}
                >
                    {status === 'expired' ? 'Renew Subscription' : 'Subscribe Now'}
                </button>
            )}
        </div>
    );
};

export default CurrentSubscription;