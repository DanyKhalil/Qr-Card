import React from "react";
import "./AvailablePlans.css";

const AvailablePlans = ({ plans = [], onPlanSelect, selectedPlanId }) => {
    if (!plans.length) return null;

    return (
        <div className="available-plans">
            <h3>Available Plans</h3>
            <div className="plans-list">
                {plans.map((plan) => {
                    const isSelected = plan.id === selectedPlanId;

                    return (
                        <div
                            className={`plan-card ${isSelected ? "selected" : ""}`}
                            key={plan.id}
                        >
                            <h4>{plan.name}</h4>
                            <p>{plan.description}</p>
                            <p>
                                Price: ${plan.price} {plan.currency}
                            </p>

                            <button
                                onClick={() => onPlanSelect(plan)}
                                disabled={isSelected}
                            >
                                {isSelected ? "Selected" : "Choose Plan"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AvailablePlans;
