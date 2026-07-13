import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "../api/users";
import { getUser, setUser as saveUserToLocal } from "../utils/auth";
import { type User } from "../types";
import { toast } from "react-toastify";

export const Profile = () => {
  const localUser = getUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localUser?.id) return;
      try {
        const response = await getUserById(localUser.id);
        if (response.success && response.user) {
          setProfile(response.user);
        }
      } catch (err) {
        // Errors handled by api client
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
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Could not load profile</div>;

  return (
    <div>
      <h2>My Profile</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Full Name:</label>
          <input name="full_name" value={profile.full_name || ""} onChange={handleChange} required />
        </div>
        <div>
          <label>Username:</label>
          <input name="username" value={profile.username || ""} disabled />
        </div>
        <div>
          <label>Phone:</label>
          <input name="phone" value={profile.phone || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={profile.email || ""} onChange={handleChange} />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};
