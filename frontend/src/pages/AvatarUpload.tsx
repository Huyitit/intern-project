import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadAvatar } from "../api/users";
import { getUser, setUser } from "../utils/auth";
import { Link } from "react-router-dom";

export const AvatarUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    console.log(selectedFile.name);
    setUploading(true);
    toast.info("Uploading avatar...");
    try {
      const response = await uploadAvatar(selectedFile);
      if (response.success && response.avatar_url) {
        toast.success("Avatar uploaded successfully!");
        
        // Update user in local storage
        const currentUser = getUser();
        if (currentUser) {
          currentUser.avatar_url = response.avatar_url;
          setUser(currentUser);
        }
        
        setSelectedFile(null);
      } else {
        toast.error(response.message || "Failed to upload avatar");
      }
    } catch (error) {
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="avatar-upload">
      <h2>Upload Avatar</h2>
      <Link to="/user">Back to Dashboard</Link>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="Preview" style={{ width: 150, height: 150, objectFit: "cover", marginTop: 10 }} />
        </div>
      )}
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
    </div>
  );
};
