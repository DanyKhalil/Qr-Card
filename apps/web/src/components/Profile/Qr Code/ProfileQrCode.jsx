import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./ProfileQrCode.css";
import Button from "../Button/Button";
import { IoDownload } from "react-icons/io5";

const ProfileQrCode = ({ profileUrl }) => {
    // it takes a sparameter the profile Url which will be localhose//1557//profile/id
    // an d return the qr code

    const qrRef = useRef(null);
    const [qrSize, setQrSize] = useState(180);

    if (!profileUrl) return null;

    // this is used for responsive size for qr code
    useEffect(() => {
        const updateSize = () => {
            if (qrRef.current) {
                const containerWidth = qrRef.current.offsetWidth;
                setQrSize(containerWidth * 0.6);
            }
        };
        updateSize();

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // amd this is for the download button
    const handleDownload = () => {
        const canvas = qrRef.current.querySelector("canvas");
        if (!canvas) return;

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "profile_qr_code.png";
        link.click();
    };

    return (
        <div className="qr-container" ref={qrRef}>
            <h2 className="section-title">Share Profile</h2>
            <QRCodeCanvas 
                value={profileUrl} 
                size={qrSize}
                bgColor="#ffffff"
                fgColor="#0a0a0a"
            />
            <br></br>
            <Button
                text="Download QR Code"
                color="green"
                bold
                action={handleDownload}
                width={qrSize}
                icon={<IoDownload size={18} />} 
            />
        </div>
    );
};

export default ProfileQrCode;
