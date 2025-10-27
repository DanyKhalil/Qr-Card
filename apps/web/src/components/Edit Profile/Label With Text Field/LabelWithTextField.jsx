import React from 'react';
import './LabelWithTextField.css';

const LabelWithTextField = ({ label, id, value }) => {
    return (
        <div className="label-field">
            <label htmlFor={id} className="label-field__label">{label}</label>
            <input
                type="text"
                id={id}
                value={value}
                className="label-field__input"
            />
        </div>
    );
};

export default LabelWithTextField;
