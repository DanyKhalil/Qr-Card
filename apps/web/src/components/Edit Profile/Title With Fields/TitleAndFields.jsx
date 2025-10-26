import React from 'react';
import './TitleAndFields.css';
import LabelWithTextField from '../Label With Text Field/LabelWithTextField';

const TitleAndFields = ({ title, fields }) => {
  if (!fields || !Array.isArray(fields) || fields.length === 0) return null;

  return (
    <section className="title-and-fields">
      <h2 className="title-and-fields__title">{title}</h2>
      <div className="title-and-fields__fields">
        {fields.map((field, index) => (
          <LabelWithTextField
            key={index}
            label={field.label}
            id={field.id}
            value={field.value}
          />
        ))}
      </div>
    </section>
  );
};

export default TitleAndFields;
