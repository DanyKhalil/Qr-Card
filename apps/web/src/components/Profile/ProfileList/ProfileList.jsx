import React from "react";
import { IoPersonOutline } from "react-icons/io5";
import './ProfileList.css'; // reuse most of your previous styles

const ProfileList = ({ profiles = [], onProfileClick = () => {} }) => {
  if (!profiles.length) {
    return (
      <div className="profile-visits-table no-visits">
        <p>No profiles to display</p>
      </div>
    );
  }

  return (
    <div className="profile-visits-table">
      <div className="table-header">
        <h3>Profiles</h3>
        <span className="visits-count">{profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'}</span>
      </div>

      <div className="visits-container">
        {profiles.map((profile) => (
          <div key={profile.follow_id} className="visit-card">
            <div 
              className="visitor-info"
              onClick={() => onProfileClick(profile.user_id)}
            >
              {profile.profile_pic_url ? (
                <img
                  src={profile.profile_pic_url}
                  alt={profile.name}
                  className="visitor-avatar"
                />
              ) : (
                <div className="anonymous-avatar">
                  <IoPersonOutline />
                </div>
              )}

              <div className="visitor-details">
                <h4 className="visitor-name">{profile.name}</h4>
                {profile.headline && <p className="visit-time">{profile.headline}</p>}
                {profile.bio && <p className="qr-badge">{profile.bio}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileList;
