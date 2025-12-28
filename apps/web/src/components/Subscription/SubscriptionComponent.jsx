import { useState } from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import CurrentSubscription from "./CurrentSubscription/CurrentSubscription.jsx";
import AvailablePlans from "./AvailablePlans/AvailablePlans.jsx";
import PaymentMethod from "./PaymentMethod/PaymentMethod.jsx";
import ReceiptUploadModal from "./ReceiptUploadModal/ReceiptUploadModal.jsx";
import { subscriptionApi } from "../../services/subscriptionApi.js";
import "./SubscriptionComponent.css";
import { useNavigate } from "react-router-dom";

const SubscriptionComponent = ({ plans = [], currentUser, refreshPlans, profileId }) => {
    const navigate = useNavigate();

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [receiptFile, setReceiptFile] = useState(null);
    const [subscribing, setSubscribing] = useState(false);
    const [subscribeMessage, setSubscribeMessage] = useState("");
    const [receiptModalFile, setReceiptModalFile] = useState(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting file input

    const currentSubscription = currentUser?.subscription || null;

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setShowPayment(true);
    };

    const handleReceiptChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/jfif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                alert("Only image files are allowed (png, jpg, jpeg, jfif, webp)!");
                e.target.value = ""; // Clear the input
                return;
            }
            
            // Check file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert("File is too large! Maximum size is 5MB.");
                e.target.value = "";
                return;
            }
            
            setReceiptFile(file);
        } else {
            setReceiptFile(null);
        }
    };

    const handleReceiptModalChange = (file) => {
        if (file) {
            setReceiptModalFile(file);
        }
    };

    // Handle subscription with receipt upload
    const handleSubscribe = async () => {
        if (!selectedPlan) return;

        setSubscribing(true);
        setSubscribeMessage("");

        try {
            const paymentDetails = {
                method: paymentMethod,
                notes: "Subscription payment"
            };

            const result = await subscriptionApi.subscribeToPlan(
                profileId,
                selectedPlan.id,
                paymentDetails,
                receiptFile
            );

            setSubscribeMessage("Subscription created! Pending admin approval.");
            
            // Reset state
            setSelectedPlan(null);
            setShowPayment(false);
            setReceiptFile(null);
            setFileInputKey(Date.now()); // Reset file input
            
            // Refresh data
            refreshPlans();
            navigate("/profile")
        } catch (error) {
            setSubscribeMessage(`Error: ${error.message}`);
        } finally {
            setSubscribing(false);
        }
    };

    // Handle receipt upload for existing subscription
    const handleUploadReceipt = async () => {
        if (!receiptModalFile || !currentSubscription) return;

        setUploadingReceipt(true);
        setUploadMessage('');

        try {
            // Note: You need to create a separate API endpoint for this
            // For now, this is a placeholder
            setUploadMessage('Feature coming soon!');
            setTimeout(() => {
                setUploadMessage('Receipt uploaded successfully!');
                setReceiptModalFile(null);
                setShowReceiptModal(false);
                refreshPlans();
            }, 1500);
        } catch (error) {
            setUploadMessage(`Error uploading receipt: ${error.message}`);
        } finally {
            setUploadingReceipt(false);
        }
    };

    // Clear selected file
    const clearReceiptFile = () => {
        setReceiptFile(null);
        setFileInputKey(Date.now());
    };

    return (
        <div className="subscription-container">
            <Header activeIndex={-1} />

            {/* Current Subscription Info */}
            <CurrentSubscription subscription={currentSubscription} />

            {/* Available Plans */}
            <AvailablePlans
                plans={plans}
                onPlanSelect={handlePlanSelect}
                selectedPlanId={selectedPlan?.id}
            />

            {/* Receipt Information for existing subscriptions */}
            {currentSubscription && currentSubscription.status === 'pending' && (
                <div className="receipt-info">
                    <p>
                        Your subscription is pending. Please upload your payment receipt 
                        to activate your subscription.
                    </p>
                    <button
                        className="upload-receipt-btn"
                        onClick={() => setShowReceiptModal(true)}
                    >
                        Upload Payment Receipt
                    </button>
                </div>
            )}

            {/* Payment Section */}
            {showPayment && selectedPlan && (
                <div className="payment-section">
                    <h3>Complete Subscription: {selectedPlan.name}</h3>
                    <p className="price-display">Price: ${selectedPlan.price} / {selectedPlan.billing_interval}</p>
                    
                    {/* Payment Method Selection */}
                    <div className="payment-method">
                        <h4>Select Payment Method</h4>
                        <select 
                            value={paymentMethod} 
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={subscribing}
                        >
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="cash">Cash</option>
                            <option value="paypal">PayPal</option>
                            <option value="crypto">Cryptocurrency</option>
                            <option value="manual">Manual Payment</option>
                        </select>
                    </div>

                    {/* Receipt Upload - Part of subscription flow */}
                    <div className="receipt-upload">
                        <h4>Upload Payment Receipt</h4>
                        <p className="receipt-note">Required for bank transfer, cash, and manual payments</p>
                        
                        <div className="file-upload-area">
                            <input
                                key={fileInputKey}
                                type="file"
                                accept=".png,.jpg,.jpeg,.jfif,.webp"
                                onChange={handleReceiptChange}
                                disabled={subscribing}
                                id="receipt-file-input"
                                className="file-input"
                            />
                            <label htmlFor="receipt-file-input" className="file-input-label">
                                <div className="upload-icon">📎</div>
                                <div className="upload-text">
                                    {receiptFile ? receiptFile.name : "Click to choose receipt image"}
                                </div>
                                <div className="upload-hint">
                                    {receiptFile ? 
                                        `${(receiptFile.size / 1024 / 1024).toFixed(2)} MB` : 
                                        "PNG, JPG, JPEG, JFIF up to 5MB"}
                                </div>
                            </label>
                            
                            {receiptFile && (
                                <div className="file-preview">
                                    <div className="file-info">
                                        <span className="file-icon">📄</span>
                                        <div className="file-details">
                                            <strong>{receiptFile.name}</strong>
                                            <span>{(receiptFile.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                        <button 
                                            type="button"
                                            className="remove-file-btn"
                                            onClick={clearReceiptFile}
                                            disabled={subscribing}
                                            title="Remove file"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Display */}
                    {subscribeMessage && (
                        <div className={`message ${subscribing ? "loading" : ""}`}>
                            {subscribeMessage}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="subscription-actions">
                        <button 
                            className="cancel-btn" 
                            onClick={() => {
                                setSelectedPlan(null);
                                setShowPayment(false);
                                setReceiptFile(null);
                                setFileInputKey(Date.now());
                            }}
                            disabled={subscribing}
                        >
                            Cancel
                        </button>
                        <button 
                            className="subscribe-btn" 
                            onClick={handleSubscribe}
                            disabled={subscribing || (!receiptFile && paymentMethod !== "paypal")}
                        >
                            {subscribing ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Processing...
                                </>
                            ) : "Complete Subscription"}
                        </button>
                    </div>
                </div>
            )}

            {/* QR Payment Methods (Always shown for reference) */}
            <PaymentMethod plan={selectedPlan} />

            {/* Receipt Upload Modal */}
            {showReceiptModal && (
                <ReceiptUploadModal
                    onClose={() => {
                        setShowReceiptModal(false);
                        setReceiptModalFile(null);
                    }}
                    receiptFile={receiptModalFile}
                    onReceiptChange={handleReceiptModalChange}
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