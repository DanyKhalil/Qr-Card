import "./ReceiptUploadModal.css";

const ReceiptUploadModal = ({ 
    onClose, 
    receiptFile, 
    onReceiptChange, 
    onUpload, 
    uploading, 
    message 
}) => {

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/jfif", "image/webp"];
            if (!validTypes.includes(selectedFile.type)) {
                alert("Only image files are allowed (png, jpg, jpeg, jfif, webp)!");
                return;
            }
            
            // Check file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (selectedFile.size > maxSize) {
                alert("File is too large! Maximum size is 5MB.");
                return;
            }
            
            onReceiptChange(selectedFile);
        }
    };

    return (
        <div className="receipt-modal-overlay">
            <div className="receipt-modal">
                <button className="close-modal" onClick={onClose} disabled={uploading}>
                    ×
                </button>
                
                <div className="modal-header">
                    <h3>📄 Upload Payment Receipt</h3>
                    <p className="modal-note">
                        For existing subscriptions only. Upload a clear image of your payment receipt.
                    </p>
                </div>

                <div className="upload-area">
                    <label className="file-upload-btn">
                        <div className="upload-icon">📁 HELLOOO</div>
                        <div className="upload-text">
                            {receiptFile ? receiptFile.name : "Click to choose file"}
                        </div>
                        <div className="upload-subtext">
                            {receiptFile ? `${(receiptFile.size / 1024 / 1024).toFixed(2)} MB` : "PNG, JPG, JPEG, JFIF up to 5MB"}
                        </div>
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.jfif,.webp"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
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
                                    className="remove-file"
                                    onClick={() => onReceiptChange(null)}
                                    disabled={uploading}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`upload-message ${uploading ? "uploading" : "success"}`}>
                        {uploading ? (
                            <div className="loading-spinner"></div>
                        ) : null}
                        {message}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose} disabled={uploading}>
                        Cancel
                    </button>
                    <button 
                        className="send-btn" 
                        onClick={onUpload} 
                        disabled={uploading || !receiptFile}
                    >
                        {uploading ? (
                            <>
                                <span className="loading-spinner-small"></span>
                                Uploading...
                            </>
                        ) : "Upload Receipt"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptUploadModal;