import React from 'react';
import './LabelWithTextField.css';

const LabelWithTextField = ({ label, type, id, value, onChange, onBlur, errorMessage }) => {
    return (
        <div className="label-field">
            <label htmlFor={id} className="label-field__label">{label}</label>
            <div className="label-field__input-container">
                <input
                    type={type? type:"text"}
                    id={id}
                    value={value}
                    className={`label-field__input ${errorMessage ? 'label-field__input--error' : ''}`}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                <div className="label-field__error-message">
                    {errorMessage || ''}
                </div>
            </div>
        </div>
    );
};

export default LabelWithTextField;