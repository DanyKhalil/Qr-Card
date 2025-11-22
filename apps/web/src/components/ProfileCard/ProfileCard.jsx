import React from "react";
import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline } from 'react-icons/io5';

const ProfileCard = ({ id, name, title, imageUrl }) => {
  const navigate = useNavigate();
  return (
    <div className="profile-card">
      {name != null ? (
        <img
          src={imageUrl || "https://via.placeholder.com/80"} // fallback if no profile pic
          alt={name}
          className="profile-image"
        />
      ) : (
        <div className="anonymous-avatar">
            <IoPersonOutline />
        </div>
      )}
      <h2 className="profile-name">{name}</h2>
      <p className="profile-title">{title}</p>
      <button className="profile-button" onClick={()=>navigate(`/profile/${id}`)}>View Profile</button>
    </div>
  );
};


export default ProfileCard;
