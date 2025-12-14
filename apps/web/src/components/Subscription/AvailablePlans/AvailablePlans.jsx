import React from "react";
import './AvailablePlans.css';

const AvailablePlans = ({ plans = [], onPlanSelect }) => {
    if (!plans.length) return null;

    return (
        <div className="available-plans">
            <h3>Available Plans</h3>
            <div className="plans-list">
                {plans.map((plan) => (
                    <div className="plan-card" key={plan.id}>
                        <h4>{plan.name}</h4>
                        <p>{plan.description}</p>
                        <p>Price: ${plan.price} {plan.currency}</p>
                        <button onClick={() => onPlanSelect(plan)}>Choose Plan</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailablePlans;
