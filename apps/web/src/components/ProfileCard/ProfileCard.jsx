import React from "react";
import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ id, name, title, imageUrl }) => {
  const navigate = useNavigate();
  return (
    <div className="profile-card">
      <img
        src={imageUrl || "https://via.placeholder.com/80"} // fallback if no profile pic
        alt={name}
        className="profile-image"
      />
      <h2 className="profile-name">{name}</h2>
      <p className="profile-title">{title}</p>
      <button className="profile-button" onClick={()=>navigate(`/profile/${id}`)}>View Profile</button>
    </div>
  );
};


export default ProfileCard;
