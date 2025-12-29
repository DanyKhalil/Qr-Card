import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./ProfilePhotoAndHeadline.css"
import ProfilePic from "../Profile Pic/ProfilePic.jsx"
import Headline from "../Headline/Headline.jsx"
import Button from '../Button/Button.jsx';
import { IoPencil, IoTrash, IoAnalytics, IoSave, IoClose, IoAdd } from "react-icons/io5";

const ProfilePhotoAndHeadline = ({id, profileId, photo, name, dob, headline, followers, following, fetchUserProfile}) => {
    const navigate = useNavigate();

    const handleAnalytics = () => {
        navigate(`/profile-analytics`);
    };
    const handleUpdate = () => {
        navigate(`/edit-profile`);
    };


    const getToken = () => {
        return localStorage.getItem("token");
    };
    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };
    const getCurrentUserProfileId = () => {
        const profileId = localStorage.getItem("profileId");
        return profileId;
    };


    return (
        <div className="profile-section__wrapper">
            <div className="profile-section__left">
                <ProfilePic photo={photo} />
                <Headline id={id} profileId={profileId} name={name} dob={dob} headline={headline} followers={followers} following={following} fetchUserProfile={fetchUserProfile}/>
            </div>

            <div className="profile-section__right">
                {profileId===getCurrentUserProfileId() && (
                    <Button
                        text="Profile Analytics"
                        color="green"
                        bold
                        action={handleAnalytics}
                        icon={<IoAnalytics size={18} />}
                    />
                )}
                {profileId===getCurrentUserProfileId() && (
                    <Button
                        text="Edit Profile"
                        color="coral"
                        bold
                        action={handleUpdate}
                        icon={<IoPencil size={18} />} 
                    />
                )}
            </div>
        </div>
    )    
}

export default ProfilePhotoAndHeadline;