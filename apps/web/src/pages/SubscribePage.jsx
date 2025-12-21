import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SubscriptionComponent from "../components/Subscription/SubscriptionComponent";
import { subscriptionApi } from "../services/subscriptionApi.js";

const Subscription = () => {
    const getToken = () => {
        return localStorage.getItem("token");
    };
    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    };

    const currentUser = getCurrentUser();

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await subscriptionApi.getAvailablePlans();
            setPlans(data.plans);

        } catch (err) {
            setError(err.response?.data?.error || "Failed to load subscription plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser || !getToken()) {
            window.location.href = "/login";
            return;
        }

        fetchPlans();
    }, []);

    if (loading) {
        return (
            <div className="App">
                <Header />
                <div className="loading-container">
                    <p>Loading subscription plans...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="App">
                <Header />
                <div className="error-container" style={{paddingTop: '100px'}}>
                    <p>{error}</p>
                    <button onClick={fetchPlans}>Retry</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="App" style={{paddingTop: '100px'}}>
            <SubscriptionComponent
                plans={plans}
                refreshPlans={fetchPlans}
                currentUser={currentUser}
            />
        </div>
    );
};

export default Subscription;
