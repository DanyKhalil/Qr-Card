import React from "react";
import CustomItemCard from "../CustomItemCard/CustomItemCard";
import "./CustomContentDisplay.css"; 

const CustomContentDisplay = ({ customContent }) => {
  return (
    <section className="custom-content-section">
      <h2 className="custom-content-title">{customContent.name}</h2>

      <div className="custom-cards-grid">
        {customContent.items.map((item) => (
            <CustomItemCard
                key={item.id}
                customItem={{
                    title: item.title,
                    fields: customContent.fields,
                    values: item.values.reduce((acc, val) => {
                    if (val.field_key && val.value !== undefined) acc[val.field_key] = val.value;
                    return acc;
                    }, {}),
                }}
            />
        ))}
      </div>
    </section>
  );
};

export default CustomContentDisplay;
