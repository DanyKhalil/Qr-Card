import { useState } from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import CurrentSubscription from "./CurrentSubscription/CurrentSubscription.jsx";
import AvailablePlans from "./AvailablePlans/AvailablePlans.jsx";
import PaymentMethod from "./PaymentMethod/PaymentMethod.jsx";

const SubscriptionComponent = ({ plans = [], currentUser, refreshPlans }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    const currentSubscription = currentUser?.subscription || null;

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setShowPayment(true); // Show payment section when plan is selected
    };

    return (
        <div>
            <Header activeIndex={-1} />

            {/* Current Subscription Info */}
            <CurrentSubscription subscription={currentSubscription} />

            {/* Available Plans */}
            <AvailablePlans
                plans={plans}
                onPlanSelect={handlePlanSelect}
            />

            {/* Payment Section - Appears after selecting a plan */}
            {showPayment && selectedPlan && (
                <PaymentMethod
                    plan={selectedPlan}
                    currentUser={currentUser}
                    refreshPlans={refreshPlans}
                />
            )}

            <Footer />
        </div>
    );
};

export default SubscriptionComponent;
