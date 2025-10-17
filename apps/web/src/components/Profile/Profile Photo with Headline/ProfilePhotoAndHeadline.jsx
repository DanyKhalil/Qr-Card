import React from 'react';
import "./ProfilePhotoAndHeadline.css"
import ProfilePic from "../Profile Pic/ProfilePic.jsx"
import Headline from "../Headline/Headline.jsx"

const ProfilePhotoAndHeadline = ({photo, name, dob, headline,}) => {
    return (
        <div className = "profile-photo-and-headline">
            <ProfilePic photo={photo} borderColor="#82C294"/>
            <Headline 
                    name={name}
                    dob={dob}
                    headline={headline}
            />
        </div>
    )    
}

export default ProfilePhotoAndHeadline;