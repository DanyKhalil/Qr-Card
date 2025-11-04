import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Camera.css';
import Button from '../../Profile/Button/Button';

const Camera = ({setUrlToVisit}) => {
    const [scanResult, setScanResult] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const scannerRef = useRef(null);
    const qrBoxSize = 250;

    useEffect(() => {
        if (scanResult) {
            try {
                setUrlToVisit(scanResult);
            } catch (error) {
                console.error(error);
            }
        }
    }, [scanResult]);

    const activateScanner = () => {
        setCameraActive(true);
        setTimeout(() => {
            if (scannerRef.current) {
                // here adding a html5qrcodscanner object
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

                scanner.render( (decodedText) => {
                    setScanResult(decodedText);
                    scanner.clear();
                    setCameraActive(false);
                    
                    if (isValidUrl(decodedText)) {
                        // window.location.href = decodedText;
                    }
                }, (error) => {
                    console.debug('QR scan error:', error);
                });

                /// storing a scanner instance for cleanup
                scannerRef.current.scanner = scanner;
            }
        }, 100);
    };

    const deactivateScanner = () => {
        if (scannerRef.current?.scanner) {
            scannerRef.current.scanner.clear();
        }
        setCameraActive(false);
        setScanResult(null);
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const handleManualRedirect = () => {
        if (scanResult && isValidUrl(scanResult)) {
            window.location.href = scanResult;
        }
    };

    return (
        <div className="scan-qr-container">
            <div className="scanner-header">
                <h1>QR Code Scanner</h1>
                <p>Position QR code within the frame to scan</p>
            </div>

            <div className="camera-viewport">
                <div 
                    id="qr-reader" 
                    ref={scannerRef}
                    className={`qr-reader ${cameraActive ? 'active' : ''}`}
                >
                    {!cameraActive && (
                        <div className="camera-placeholder">
                            <div className="placeholder-icon">📷</div>
                            <p>Camera inactive</p>
                        </div>
                    )}
                </div>
        
                {/* <div className="scan-frame">
                    <div className="frame-corner top-left"></div>
                    <div className="frame-corner top-right"></div>
                    <div className="frame-corner bottom-left"></div>
                    <div className="frame-corner bottom-right"></div>
                </div> */}
            </div>

            <div className="scanner-controls">
                {!cameraActive ? 
                    (<Button text="Start Scanning" action={activateScanner} color="green"/>) 
                    : 
                    (<Button text="Stop Camera" action={deactivateScanner} color="coral"/>)
                }
            </div>

            {scanResult && (
                <div className="scan-result">
                    <h3>Scan Successful!</h3>
                    <div className="result-url">
                        <strong>Detected URL:</strong>
                        <span className="url-text">{scanResult}</span>
                    </div>
                    <div className="result-actions">
                        <Button text="Visit Website" action={handleManualRedirect} color="green" disabled={!isValidUrl(scanResult)}/> 
                        <Button text="Scan Again" action={() => setScanResult(null)} color="green"/> 
                    </div>
                    {!isValidUrl(scanResult) && (
                        <p className="error-message">Invalid URL detected</p>
                    )}
                </div>
            )}

            <div className="scanner-instructions">
                <h4>How to scan:</h4>
                <ul>
                    <li>Ensure good lighting</li>
                    <li>Hold steady and align QR code within frame</li>
                    <li>Keep appropriate distance from camera</li>
                </ul>
            </div>
        </div>
    );
};

export default Camera;