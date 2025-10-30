import React from 'react';
import './LabelWithTextField.css';

const LabelWithTextField = ({ label, type, id, value, setter }) => {
    return (
        <div className="label-field">
            <label htmlFor={id} className="label-field__label">{label}</label>
            <input
                type={type? type:"text"}
                id={id}
                value={value}
                className="label-field__input"
                onChange={(e)=>setter(e.target.value)}
            />
        </div>
    );
};

export default LabelWithTextField;
