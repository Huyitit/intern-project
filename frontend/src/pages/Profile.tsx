import React, { useState, useEffect } from "react";
import { getUserById, updateUser, updateProfileByCSV } from "../api/users";
import { getUser, setUser as saveUserToLocal } from "../utils/auth";
import { type User } from "../types";
import { toast } from "react-toastify";
import styles from "./Profile.module.css";

export const Profile = () => {
  const localUser = getUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localUser?.id) return;
      try {
        const response = await getUserById(localUser.id);
        if (response.success && response.user) {
          console.log("🚀 ~ Profile ~ fetchProfile ~ response.user:", response.user);
          setProfile(response.user);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [localUser?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const response = await updateUser(profile.id, {
        id: profile.id,
        full_name: profile.full_name,
        username: profile.username,
        phone: profile.phone,
        email: profile.email,
        role: profile.role
      });
      if (response.success && response.user) {
        toast.success("Profile updated successfully");
        setProfile(response.user);
        saveUserToLocal(response.user);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile || !profile) return;
    setUploadingCsv(true);
    toast.info("Uploading CSV...");
    try {
      const response = await updateProfileByCSV(profile.id, csvFile);
      if (response.success && response.user) {
        toast.success("Profile updated via CSV successfully");
        setProfile(response.user);
        saveUserToLocal(response.user);
        setCsvFile(null); // Reset file input implicitly by clearing state
      } else {
        toast.error(response.message || "Failed to update profile via CSV");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading CSV");
    } finally {
      setUploadingCsv(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Could not load profile</div>;

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <h2>My Profile</h2>
        
        <div className={styles.divider}></div>
        
        <h3>Update by CSV</h3>
        <div className={styles.formGroup}>
          <input className={styles.fileInput} type="file" accept=".csv" onChange={handleCsvChange} />
        </div>
        <button className={styles.submitBtn} onClick={handleCsvUpload} disabled={!csvFile || uploadingCsv}>
          {uploadingCsv ? "Uploading..." : "Upload CSV"}
        </button>

        <div className={styles.divider}></div>

        <h3>Manual Update</h3>
        <form onSubmit={handleUpdate}>
          <div className={styles.formGroup}>
            <label>Full Name:</label>
            <input className={styles.inputField} name="full_name" value={profile.full_name || ""} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Username:</label>
            <input className={styles.inputField} name="username" value={profile.username || ""} disabled style={{opacity: 0.7}} />
          </div>
          <div className={styles.formGroup}>
            <label>Phone:</label>
            <input className={styles.inputField} name="phone" value={profile.phone || ""} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input className={styles.inputField} name="email" value={profile.email || ""} onChange={handleChange} />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};
