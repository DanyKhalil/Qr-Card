import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Camera.css';
import Button from '../../Profile/Button/Button';

const Camera = () => {
    const [scanResult, setScanResult] = useState(null); // this one for saving the url from qr code
    const [cameraActive, setCameraActive] = useState(false); // this one to set a camera to active or not
    const scannerRef = useRef(null); // this ref to save the reference of the scanner
    const scanResultRef = useRef(null); // this ref to save the reference of the scanner result section down ther to scroll
    const qrBoxSize = 250;

    const activateScanner = () => {
        /// first need to check is there is already a scanner
        if (scannerRef.current?.scanner) {
            scannerRef.current.scanner.clear().catch(error => {
                console.debug('Error when clearin scaner:', error);
            });
            scannerRef.current.scanner = null;
        }

        setCameraActive(true);
        setScanResult(null);
        
        // addign a bit of delay so dom is ready
        setTimeout(() => {
            if (scannerRef.current && !scannerRef.current.scanner) {
                // adding a QRCODESCANNER object
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

                // Saving the result of the url extracted fromq r code
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

                // setting the current scanner to be this QRCODESCANNER object
                scannerRef.current.scanner = scanner;
            }
        }, 300);
    };

    // this will function deactivate the scanner, turn off camera
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

    // making sure that the url is a url, and it is on our website,
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
            console.log('Invalid URL format:', error);
            return false;
        }
    };

    const handleManualRedirect = () => {
        if (scanResult && isValidUrl(scanResult)) {
            // i am appending the qrScan parameter to retrieve it in the other page
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
            if (scannerRef.current?.scanner) {
                scannerRef.current.scanner.clear().catch(error => {
                    console.debug('Cleanup error:', error);
                });
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
                <p>Position QR code within the frame to scan</p>
            </div>

            <div className="camera-viewport">
                <div 
                    id="qr-reader" 
                    ref={scannerRef}
                    key={cameraActive ? 'scanner-active' : 'scanner-inactive'}
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
                <div className="scan-result" ref={scanResultRef}>
                    <h3>Scan Successful!</h3>
                    <div className="result-url">
                        <strong>Detected URL:</strong>
                        <span className="url-text">{scanResult}</span>
                    </div>
                    <div className="result-actions">
                        <Button text="Visit Website" action={handleManualRedirect} color="green" disabled={!isValidUrl(scanResult)}/> 
                        {/* <Button text="Scan Again" action={() => setScanResult(null)} color="green"/>  */}
                        <Button text="Scan Again" action={activateScanner} color="green"/>
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