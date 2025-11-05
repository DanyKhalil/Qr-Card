import React, { useRef } from 'react'; // ADD useRef import
import { useNavigate, useParams } from 'react-router-dom';
import "./ProfilePhotoAndHeadline.css";
import ProfilePic from '../../Profile/Profile Pic/ProfilePic.jsx';
import Button from '../../Profile/Button/Button.jsx';

const ProfilePhotoAndHeadline = ({ 
    photo, 
    saveAction,
    onProfilePicChange,
    onCoverPhotoChange,
    onRemoveProfilePic,
    onRemoveCoverPhoto,
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const profileFileInputRef = useRef(null);
    const coverFileInputRef = useRef(null);

    const handleCancel = () => {
        navigate(`/profile/${id}`);
    };
    const handleSave = () => {
        saveAction();
    };

    const handleUpload = () => {
        profileFileInputRef.current?.click();
    };
    
    const handleRemove = () => {
        onRemoveProfilePic();
    };

    const handleChangeCover = () => {
        coverFileInputRef.current?.click();
    };
    
    const handleRemoveCover = () => {
        onRemoveCoverPhoto();
    };

    const handleProfileFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('Profile picture must be less than 2MB');
                return;
            }
            onProfilePicChange(file);
        }
        event.target.value = '';
    };

    const handleCoverFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 4 * 1024 * 1024) {
                alert('Cover photo must be less than 4MB');
                return;
            }
            onCoverPhotoChange(file);
        }
        event.target.value = '';
    };

    return (
        <div className="profile-section__wrapper">
            <input
                type="file"
                ref={profileFileInputRef}
                onChange={handleProfileFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <input
                type="file"
                ref={coverFileInputRef}
                onChange={handleCoverFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

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