import React from "react";
import './CurrentSubscription.css';

const CurrentSubscription = ({ subscription }) => {
    if (!subscription || !subscription.plan_name) {
        return (
            <div className="current-subscription no-subscription">
                <h2>No Active Subscription</h2>
                <p>You currently do not have an active subscription plan.</p>
            </div>
        );
    }

    const { plan_name, starts_at, expires_at, status } = subscription;

    return (
        <div className={`current-subscription ${status}`}>
            <h2>{plan_name}</h2>
            <p>Status: <strong>{status}</strong></p>
            {starts_at && <p>Started on: {new Date(starts_at).toLocaleDateString()}</p>}
            {expires_at && <p>Expires on: {new Date(expires_at).toLocaleDateString()}</p>}
        </div>
    );
};

export default CurrentSubscription;
