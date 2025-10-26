import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./ProfilePhotoAndHeadline.css";
import ProfilePic from '../../Profile/Profile Pic/ProfilePic.jsx';
import Button from '../../Profile/Button/Button.jsx';

const ProfilePhotoAndHeadline = ({ photo }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleCancel = () => {
        navigate(`/profile/${id}`);
    };
    const handleSave = () => {
        alert("Saved!");
    };

    const handleUpload = () => {
        alert("Change Profile clicked");
    };
    const handleRemove = () => {
        alert("Remove Profile clicked");
    };

    const handleChangeCover = () => {
        alert("Change Cover clicked");
    };
    const handleRemoveCover = () => {
        alert("Remove Cover clicked");
    };

    return (
        <div className="profile-section__wrapper">
            {/* LEFT SIDE */}
            <div className="profile-section__left">
                <div className="profile-section__pic-and-buttons">
                    <ProfilePic photo={photo} borderColor="#82C294" />
                    <div className="profile-section__vertical-buttons">
                        <Button text="Change" color="green" action={handleUpload} width={100}/>
                        <Button text="Remove" color="coral" action={handleRemove} width={100}/>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="profile-section__right" style={{marginBottom:"-40px"}}>
                <div className="profile-section__top-buttons">
                    <Button text="Change" color="green" action={handleChangeCover} width={100}/>
                    <Button text="Remove" color="coral" action={handleRemoveCover} width={100}/>
                </div>
                <br/>

                <Button text="Save Changes" color="green" bold action={handleSave} />
                <Button text="Cancel" color="coral" bold action={handleCancel} />
            </div>
        </div>
    );
};

export default ProfilePhotoAndHeadline;
