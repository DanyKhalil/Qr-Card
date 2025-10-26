import React from "react";
import "./Button.css";

const Button = ({
    text = "Click Me",
    bold = false,
    color = "coral", // coud be green or coral
    action = () => {},
}) => {
    const colorClass = color === "coral" ? "fancy-btn__coral" : "fancy-btn__green";

    return (
        <button
            className={`fancy-btn__root ${colorClass} ${
                bold ? "fancy-btn__bold" : ""
            }`}
            onClick={action}
        >
            {text}
        </button>
    );
};

export default Button;
