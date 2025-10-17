import React from 'react';
import './Footer.css';

const Footer = ({
    className = "",
    companyName = "QR Card",
    year = "2025"
}) => {
    const currentYear = year === "current" ? new Date().getFullYear() : year;

    return (
        <footer className={`footer ${className}`}>
        <div className="footer-content">
            <p className="footer-text">
            © {companyName} {currentYear}. All rights reserved.
            </p>
        </div>
        </footer>
    );
};

export default Footer;