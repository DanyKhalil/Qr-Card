import React from 'react';
import './Headline.css';

const Headline = ({ 
    name, 
    dob, 
    headline,
}) => {

    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
    
        return age;
    };

    const age = calculateAge(dob);

    const containerClasses = `profile-header`;

    return (
        <div className={containerClasses}>
            <div className="name-age-container">
                <span className='name'>{name}</span>
                <span className="age">{age} years old</span>
            </div>
            
            <p className="headline">{headline}</p>
        </div>
    );
};

export default Headline;