import React, { useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cropper from "react-easy-crop";
import "./ProfilePhotoAndHeadline.css";

import ProfilePic from "../../Profile/Profile Pic/ProfilePic.jsx";
import Button from "../../Profile/Button/Button.jsx";
import { IoPencil, IoTrash, IoSave, IoClose } from "react-icons/io5";

const createImage = (url) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, cropPixels, fileName = "cropped.jpeg") => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], fileName, { type: blob.type });
      resolve({ blob, file, url: URL.createObjectURL(blob) });
    }, "image/jpeg");
  });
};

const ProfilePhotoAndHeadline = ({
  photo,
  saveAction,
  onProfilePicChange,
  onCoverPhotoChange,
  onRemoveProfilePic,
  onRemoveCoverPhoto,
  disabledSave,
}) => {
  const navigate = useNavigate();
  const profileFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);

  // CROPPER STATE
  const [cropping, setCropping] = useState(false);
  const [cropImageSource, setCropImageSource] = useState(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [cropType, setCropType] = useState(null); // "profile" or "cover"

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);

  const openCropper = (file, type) => {
    setCropType(type);
    setCropAspect(type === "profile" ? 1 : 3); // ⬅️ Cover = 3:1 ratio
    setCropImageSource(URL.createObjectURL(file));
    setCropping(true);
  };

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCropPixels(croppedAreaPixels);
  }, []);

  const saveCropped = async () => {
    const result = await getCroppedImg(cropImageSource, cropPixels);

    if (cropType === "profile") onProfilePicChange(result.file);
    if (cropType === "cover") onCoverPhotoChange(result.file);

    setCropping(false);
    setCropImageSource(null);
  };

  // ======================================================
  // IMAGE INPUT HANDLERS
  // ======================================================

  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) openCropper(file, "profile");
    e.target.value = "";
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) openCropper(file, "cover");
    e.target.value = "";
  };

  // ======================================================
  // MAIN JSX
  // ======================================================
  return (
    <div className="profile-section__wrapper">
      {/* HIDDEN INPUTS */}
      <input
        type="file"
        ref={profileFileInputRef}
        onChange={handleProfileFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <input
        type="file"
        ref={coverFileInputRef}
        onChange={handleCoverFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* LEFT SIDE */}
      <div className="profile-section__left">
        <div className="profile-section__pic-and-buttons">
          <ProfilePic photo={photo} borderColor="#82C294" />
          <div className="profile-section__vertical-buttons">
            <Button
              text="Change"
              color="green"
              action={() => profileFileInputRef.current.click()}
              width={120}
              icon={<IoPencil size={18} />}
            />
            <Button
              text="Remove"
              color="coral"
              action={onRemoveProfilePic}
              width={120}
              icon={<IoTrash size={18} />}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="profile-section__right" style={{ marginBottom: "-40px" }}>
        <div className="profile-section__top-buttons">
          <Button
            text="Change"
            color="green"
            action={() => coverFileInputRef.current.click()}
            width={120}
            icon={<IoPencil size={18} />}
          />
          <Button
            text="Remove"
            color="coral"
            action={onRemoveCoverPhoto}
            width={120}
            icon={<IoTrash size={18} />}
          />
        </div>

        <br />

        <Button
          text="Save Changes"
          color="green"
          bold
          action={saveAction}
          icon={<IoSave size={18} />}
          disabled={disabledSave}
        />
        <Button
          text="Cancel"
          color="coral"
          bold
          action={() => navigate("/profile")}
          icon={<IoClose size={18} />}
        />
      </div>

      {/* =======================
          CROPPER MODAL
      ======================= */}
      {cropping && (
        <div className="cropper-modal">
          <div className="cropper-container">
            <Cropper
              image={cropImageSource}
              crop={crop}
              zoom={zoom}
              aspect={cropAspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />

            <div className="cropper-buttons">
              <button onClick={() => setCropping(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={saveCropped} className="save-btn">
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoAndHeadline;
