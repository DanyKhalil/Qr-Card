import React, { useEffect, useState } from "react";

const SubscriptionSuccess = () => {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    // Replace with your logged-in user ID
    const userId = "USER_ID_HERE";

    const checkSubscription = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/subscription-status/${userId}`);
        const data = await res.json();
        if (data.status === "active") {
          setStatus("Subscription successful! 🎉");
        } else {
          setStatus("Payment pending or failed.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Error checking subscription.");
      }
    };

    checkSubscription();
  }, []);

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>{status}</h1>
    </div>
  );
};

export default SubscriptionSuccess;
