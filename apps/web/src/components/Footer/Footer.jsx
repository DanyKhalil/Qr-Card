import React from "react";
import "./Footer.css";

// Import images
import emailIcon from "../../assets/images/icons/email-icon.png";
import phoneIcon from "../../assets/images/icons/phone-icon.png";
import facebookIcon from "../../assets/images/icons/facebook-icon.png";
import twitterIcon from "../../assets/images/icons/x-icon.png";
import instagramIcon from "../../assets/images/icons/instagram-icon.png";
import linkedinIcon from "../../assets/images/icons/linkedin-icon.png";

const Footer = ({
  className = "",
  companyName = "QR Cardify",
  year = "current",
  email = "support@qrcardify.com",
  phone = "+1 (234) 567-8900",
}) => {
  const currentYear = year === "current" ? new Date().getFullYear() : year;

  return (
    <footer className={`footer ${className}`}>
      <div className="footer-container">
        {/* Left: Company & Contact Info */}
        <div className="footer-section">
          <h3 className="footer-title">{companyName}</h3>
          <p className="footer-description">
            Helping you connect digitally with ease. Reach out to us anytime!
          </p>

          {/* Email */}
          <p className="footer-contact">
            <img src={emailIcon} alt="Email" className="footer-contact-icon" />{" "}
            {email}
          </p>

          {/* Phone */}
          <p className="footer-contact">
            <img src={phoneIcon} alt="Phone" className="footer-contact-icon" />{" "}
            {phone}
          </p>

          {/* Social Media */}
          <div className="footer-socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Middle: Quick Links */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Features</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">Support</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Right: Contact Form (UI only) */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Contact Us</h4>
          <form className="footer-form">
            <input type="text" placeholder="Your Name" disabled />
            <input type="email" placeholder="Your Email" disabled />
            <textarea placeholder="Your Message" rows="3" disabled />
            <button type="button" disabled>
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {companyName} {currentYear}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
