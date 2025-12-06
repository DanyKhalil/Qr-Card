import React from "react";
import "./Button.css";

const Button = ({
    text = "Click Me",
    bold = false,
    color = "coral", // could be green or coral
    action = () => {},
    width = "220px",
    disabled = false,
    icon = null // New prop for icon
}) => {
    const colorClass = color === "coral" ? "fancy-btn__coral" : "fancy-btn__green";

    return (
        <button
            className={`fancy-btn__root ${colorClass} ${
                bold ? "fancy-btn__bold" : ""
            } ${icon ? "fancy-btn__with-icon" : ""}`}
            onClick={action}
            style={{width: width}}
            disabled={disabled}
        >
            {icon && <span className="fancy-btn__icon">{icon}</span>}
            {text}
        </button>
    );
};

export default Button;