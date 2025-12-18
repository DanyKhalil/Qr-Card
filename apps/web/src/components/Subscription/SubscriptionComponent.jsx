import { useState } from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import CurrentSubscription from "./CurrentSubscription/CurrentSubscription.jsx";
import AvailablePlans from "./AvailablePlans/AvailablePlans.jsx";
import PaymentMethod from "./PaymentMethod/PaymentMethod.jsx";
import ReceiptUploadModal from "./ReceiptUploadModal/ReceiptUploadModal.jsx";

const SubscriptionComponent = ({ plans = [], currentUser, refreshPlans }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const currentSubscription = currentUser?.subscription || null;

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setShowPayment(true);
    };



    const [receiptFile, setReceiptFile] = useState(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleReceiptChange = (file) => {
    if (file) {
        setReceiptFile(file);
    }
    };

    const handleUploadReceipt = async () => {
    if (!receiptFile || !currentSubscription) return;

    setUploadingReceipt(true);
    setUploadMessage('');

    try {
        const result = await subscriptionApi.uploadReceipt(
        currentSubscription.id,
        receiptFile
        );

        setUploadMessage('Receipt uploaded successfully!');
        setReceiptFile(null);
        setShowReceiptModal(false);
        refreshPlans(); // Refresh subscription info
    } catch (error) {
        setUploadMessage(`Error uploading receipt: ${error.message}`);
    } finally {
        setUploadingReceipt(false);
    }
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
                selectedPlanId={selectedPlan?.id}
            />


            {/* Receipt Information */}
            <div className="receipt-info">
                <p>
                    After completing the payment, you must upload a receipt copy
                    to activate your subscription.
                </p>
                <button
                    className="upload-receipt-btn"
                    onClick={() => setShowReceiptModal(true)}
                >
                    Upload Payment Receipt
                </button>
            </div>

            {/* Payment Section */}
            {showPayment && selectedPlan && (
                <PaymentMethod
                    plan={selectedPlan}
                    currentUser={currentUser}
                    refreshPlans={refreshPlans}
                />
            )}

            {/* Receipt Upload Modal */}
            {showReceiptModal && (
                <ReceiptUploadModal
                    onClose={() => setShowReceiptModal(false)}
                    receiptFile={receiptFile}
                    onReceiptChange={handleReceiptChange}
                    onUpload={handleUploadReceipt}
                    uploading={uploadingReceipt}
                    message={uploadMessage}
                />
            )}

            <Footer />
        </div>
    );
};

export default SubscriptionComponent;
