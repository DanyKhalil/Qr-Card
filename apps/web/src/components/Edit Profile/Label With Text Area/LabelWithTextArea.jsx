import React from 'react';
import './LabelWithTextArea.css';

const LabelWithTextArea = ({ label, id, value, setter }) => {
    return (
        <div className='title-and-fields'>
            <div className="label-field">
                <label htmlFor={id} className="label-field__label">{label}</label>
                <textarea
                    id={id}
                    value={value}
                    className="label-field__text-area"
                    onChange={(e)=>setter(e.target.value)}
                />
            </div>
        </div>
    );
};

export default LabelWithTextArea;
