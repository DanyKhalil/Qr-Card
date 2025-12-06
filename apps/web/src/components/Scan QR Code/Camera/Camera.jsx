import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import './Camera.css';
import Button from '../../Profile/Button/Button';
import { FaCamera, FaUpload } from 'react-icons/fa';

const Camera = () => {
    const [scanResult, setScanResult] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const scannerRef = useRef(null);
    const scanResultRef = useRef(null);
    const fileInputRef = useRef(null);
    const qrBoxSize = 250;

    const activateScanner = () => {
        if (scannerRef.current?.scanner) {
            scannerRef.current.scanner.clear().catch(error => {
                console.debug('Error when clearing scanner:', error);
            });
            scannerRef.current.scanner = null;
        }

        setCameraActive(true);
        setScanResult(null);
        
        setTimeout(() => {
            if (scannerRef.current && !scannerRef.current.scanner) {
                const scanner = new Html5QrcodeScanner(
                    'qr-reader',
                    {
                        fps: 10,
                        qrbox: { width: qrBoxSize, height: qrBoxSize },
                        supportedScanTypes: [],
                        videoConstraints: {
                            facingMode: "environment"
                        }
                    },
                    false
                );

                scanner.render((decodedText) => {
                    scanner.clear().catch(error => {
                        console.debug('Error after clearing after scanning:', error);
                    });
                    scannerRef.current.scanner = null;
                    
                    setScanResult(decodedText);
                    setCameraActive(false);
                }, (error) => {
                    console.debug('QR scan error:', error);
                });

                scannerRef.current.scanner = scanner;
            }
        }, 300);
    };

    const deactivateScanner = () => {
        setCameraActive(false);
        setScanResult(null);
        
        if (scannerRef.current?.scanner) {
            scannerRef.current.scanner.clear().catch(error => {
                console.debug('Error after deactivating scanner:', error);
            });
            scannerRef.current.scanner = null;
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPG, PNG, etc.)');
            return;
        }

        setUploading(true);
        setScanResult(null);
        
        try {
            // Create a temporary container for Html5Qrcode to avoid DOM conflicts
            const tempContainerId = 'temp-qr-container-' + Date.now();
            const tempContainer = document.createElement('div');
            tempContainer.id = tempContainerId;
            tempContainer.style.display = 'none';
            document.body.appendChild(tempContainer);
            
            // Create Html5Qrcode instance with the temporary container
            const html5QrCode = new Html5Qrcode(tempContainerId);
            
            try {
                // Scan the image file directly
                const decodedText = await html5QrCode.scanFile(file, false);
                
                setScanResult(decodedText);
                setUploading(false);
                
            } catch (scanError) {
                console.debug('QR Code scan from image error:', scanError);
                
                // Check the error message to provide better feedback
                if (scanError.message && (
                    scanError.message.includes('No QR code found') || 
                    scanError.message.includes('Not Found') ||
                    scanError.message.includes('not found')
                )) {
                    alert('Could not find a QR code in the image. Please try with a different image.');
                } else {
                    alert('Error scanning QR code from image. Please try again.');
                    console.log(scanError)
                }
                
                setUploading(false);
            } finally {
                // Always clean up the Html5Qrcode instance
                try {
                    await html5QrCode.clear();
                } catch (clearError) {
                    console.debug('Error clearing html5QrCode:', clearError);
                }
                
                // Remove the temporary container from DOM
                if (document.body.contains(tempContainer)) {
                    document.body.removeChild(tempContainer);
                }
            }
            
        } catch (error) {
            console.debug('Error processing image:', error);
            alert('Error processing image. Please try again.');
            setUploading(false);
        }
        
        // Reset file input
        event.target.value = '';
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const isValidUrl = (string) => {
        try {
            const scannedUrl = new URL(string);
            const currentUrl = new URL(window.location.href);
            
            if (scannedUrl.hostname === currentUrl.hostname) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Invalid URL format:', error);
            return false;
        }
    };

    const handleManualRedirect = () => {
        if (scanResult && isValidUrl(scanResult)) {
            const separator = scanResult.includes('?') ? '&' : '?';
            const urlWithParam = `${scanResult}${separator}qrScan=true`;
            window.location.href = urlWithParam;
        }
    };

    useEffect(() => {
        if (scanResult && scanResultRef.current) {
            setTimeout(() => {
                scanResultRef.current.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    }, [scanResult]);
    
    useEffect(() => {
        return () => {
            // Clean up any active scanner
            if (scannerRef.current?.scanner) {
                try {
                    scannerRef.current.scanner.clear().catch(error => {
                        console.debug('Cleanup error:', error);
                    });
                    scannerRef.current.scanner = null;
                } catch (error) {
                    console.debug('Error during cleanup:', error);
                }
            }
        };
    }, []);
    
    useEffect(() => {
        if (!cameraActive && scannerRef.current?.scanner) {
            scannerRef.current.scanner.clear().catch(error => {
                console.debug('Camera inactive cleanup error:', error);
            });
            scannerRef.current.scanner = null;
        }
    }, [cameraActive]);

    return (
        <div className="scan-qr-container">
            <div className="scanner-header">
                <h1>QR Code Scanner</h1>
                <p>Scan using camera or upload an image</p>
            </div>

            <div className="camera-viewport">
                <div 
                    id="qr-reader" 
                    ref={scannerRef}
                    key={cameraActive ? 'scanner-active' : 'scanner-inactive'}
                    className={`qr-reader ${cameraActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
                >
                    {!cameraActive && !uploading && (
                        <div className="camera-placeholder">
                            <div className="placeholder-icon">📷</div>
                            <p>Camera inactive</p>
                        </div>
                    )}
                    
                    {uploading && (
                        <div className="uploading-overlay">
                            <div className="spinner"></div>
                            <p>Processing image...</p>
                        </div>
                    )}
                    
                    {/* Container for Html5Qrcode when camera is active */}
                    {cameraActive && <div style={{width: '100%', height: '100%'}}></div>}
                </div>
            </div>

            <div className="scanner-controls">
                <div className="controls-row">
                    {!cameraActive ? 
                        (<Button text="Start Camera Scan" action={activateScanner} color="green" icon={<FaCamera size={16}/>}/>) 
                        : 
                        (<Button text="Stop Camera" action={deactivateScanner} color="coral"/>)
                    }
                    
                    <Button 
                        text="Upload Image" 
                        action={triggerFileInput} 
                        color="blue"
                        icon={<FaUpload size={16} />}
                        disabled={uploading || cameraActive}
                    />
                    
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>
                
                <p className="upload-note">Supported formats: JPG, PNG, GIF, etc.</p>
            </div>

            {scanResult && (
                <div className="scan-result" ref={scanResultRef}>
                    <h3>Scan Successful!</h3>
                    <div className="result-url">
                        <strong>Detected URL:</strong>
                        <span className="url-text">{scanResult}</span>
                    </div>
                    <div className="result-actions">
                        <Button 
                            text="Visit Website" 
                            action={handleManualRedirect} 
                            color="green" 
                            disabled={!isValidUrl(scanResult)}
                        /> 
                        <Button text="Scan Again" action={() => {
                            setScanResult(null);
                            activateScanner();
                        }} color="green"/>
                    </div>
                    {!isValidUrl(scanResult) && (
                        <p className="error-message">Invalid URL detected</p>
                    )}
                </div>
            )}

            <div className="scanner-instructions">
                <h4>How to scan:</h4>
                <ul>
                    <li>Use camera or upload an image containing QR code</li>
                    <li>Ensure good lighting for camera scan</li>
                    <li>Hold steady and align QR code within frame</li>
                    <li>For image upload: use clear, high-contrast images</li>
                </ul>
            </div>
        </div>
    );
};

export default Camera;