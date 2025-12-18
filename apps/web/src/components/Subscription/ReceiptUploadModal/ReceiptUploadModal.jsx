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
            // Validate image types only
            const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/jfif"];
            if (!validTypes.includes(selectedFile.type)) {
                alert("Only image files are allowed (png, jpg, jpeg, jfif)!");
                return;
            }
            onReceiptChange(selectedFile);
        }
    };

    return (
        <div className="receipt-modal-overlay">
            <div className="receipt-modal">
                <h3>Upload Payment Receipt</h3>

                {/* Custom styled file input */}
                <label className="file-upload-btn">
                    {receiptFile ? `Selected: ${receiptFile.name}` : "Choose a receipt image"}
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.jfif"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>

                {message && (
                    <p className={`upload-message ${uploading ? "uploading" : ""}`}>
                        {message}
                    </p>
                )}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose} disabled={uploading}>
                        Cancel
                    </button>
                    <button className="send-btn" onClick={onUpload} disabled={uploading || !receiptFile}>
                        {uploading ? "Uploading..." : "Send Receipt"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptUploadModal;
