import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadAvatar } from "../api/users";
import { getUser, setUser } from "../utils/auth";
import styles from "./AvatarUpload.module.css";

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
    <div className={styles.container} data-testid="avatar-upload-page">
      <div className={styles.glassCard}>
        <h2 data-testid="avatar-heading">Upload Avatar</h2>
        <div className={styles.uploadGroup} data-testid="avatar-input-group">
          <input className={styles.fileInput} data-testid="avatar-file-input" type="file" onChange={handleFileChange} />
        </div>
        {previewUrl && (
          <div className={styles.previewContainer} data-testid="avatar-preview-group">
            <img className={styles.previewImg} data-testid="avatar-preview-img" src={previewUrl} alt="Preview" />
          </div>
        )}
        <button className={styles.submitBtn} data-testid="avatar-upload-btn" onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};
