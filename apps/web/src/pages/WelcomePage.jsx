import React from "react";
import { useNavigate } from "react-router-dom"; // import hook
import "../Style/WelcomePage.css";
import bgImage from "../assets/images/icons/WelcomeBackground.png";
import topLeftImage from "../assets/images/icons/TopRightImage.png";

const WelcomePage = () => {
  const navigate = useNavigate(); // create navigate function

  const handleGetStarted = () => {
    navigate("/Registration"); // change this to your target route
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-left">
          <h1 className="title">QR CARDIFY</h1>
          <h2 className="subtitle">
            Generate your first Digital ID or <br /> Business Card
          </h2>
          <p className="description">
            Create your digital profile and say goodbye to paper business cards.
            With our web and mobile app, you can design a personal or business
            profile, share it instantly through a QR code, and let others save
            your details with one scan. It’s a smarter, eco-friendly way to
            connect and manage your information securely.
          </p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>

      <img src={bgImage} alt="Background" className="background-image" />
      <img src={topLeftImage} alt="Top Left" className="top-left-image" />
    </div>
  );
};

export default WelcomePage;
