import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function ImageUploader() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const src = URL.createObjectURL(file);
    setImageSrc(src);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = useCallback(async () => {
    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const cropArea = cropPixels;

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve({ blob, url: URL.createObjectURL(blob) });
      }, "image/jpeg");
    });
  }, [imageSrc]);

  const [cropPixels, setCropPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCropPixels(croppedAreaPixels);
  }, []);

  const onSave = async () => {
    const cropped = await getCroppedImg();
    setCroppedImage(cropped.url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>1:1 Image Cropper</h1>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />

      {/* Cropper UI */}
      {imageSrc && (
        <div style={{ position: "relative", width: 300, height: 300, marginTop: 20 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}                     // ⬅️ Forces 1:1
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {/* Save Button */}
      {imageSrc && (
        <button
          style={{ marginTop: 10, padding: "10px 20px" }}
          onClick={onSave}
        >
          Save Cropped Image
        </button>
      )}

      {/* Preview Final Image */}
      {croppedImage && (
        <div style={{ marginTop: 20 }}>
          <h3>Cropped Result:</h3>
          <img
            src={croppedImage}
            alt="Cropped"
            style={{ width: 200, height: 200, borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
}
