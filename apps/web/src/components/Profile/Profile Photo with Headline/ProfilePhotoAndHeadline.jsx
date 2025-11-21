import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./ProfilePhotoAndHeadline.css"
import ProfilePic from "../Profile Pic/ProfilePic.jsx"
import Headline from "../Headline/Headline.jsx"
import Button from '../Button/Button.jsx';
import { IoPencil, IoTrash, IoAnalytics, IoSave, IoClose, IoAdd } from "react-icons/io5";

const ProfilePhotoAndHeadline = ({photo, name, dob, headline,}) => {
    const navigate = useNavigate();

    const handleAnalytics = () => {
        navigate(`/profile-analytics`);
    };
    const handleUpdate = () => {
        navigate(`/edit-profile`);
    };


    return (
        <div className="profile-section__wrapper">
            <div className="profile-section__left">
                <ProfilePic photo={photo} borderColor="#82C294" />
                <Headline name={name} dob={dob} headline={headline} />
            </div>

            <div className="profile-section__right">
                <Button
                    text="Profile Analytics"
                    color="green"
                    bold
                    action={handleAnalytics}
                    icon={<IoAnalytics size={18} />}
                />
                <Button
                    text="Edit Profile"
                    color="coral"
                    bold
                    action={handleUpdate}
                    icon={<IoPencil size={18} />} 
                />
            </div>
        </div>
    )    
}

export default ProfilePhotoAndHeadline;