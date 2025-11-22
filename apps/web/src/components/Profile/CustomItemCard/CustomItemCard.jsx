import React from "react";
import "./CustomItemCard.css";

const CustomItemCard = ({ customItem }) => {
  if (!customItem) return null; // safeguard

  const { title, fields, values } = customItem;

  return (
    <div className="custom-card">
      <h2 className="custom-card-title">{title || "Untitled"}</h2>
      <div className="custom-card-fields">
        {fields.map((field) => (
          <div className="custom-card-field" key={field.key}>
            <span className="field-label">{field.label}:</span>
            <span className="field-value">{values?.[field.key] ?? "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomItemCard;
