import React, { useState } from "react";
import { toast } from "react-toastify";
import { createUser } from "../api/users";
import styles from "./UserCreate.module.css";

export const UserCreate = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createUser(formData);
      if (response.success) {
        toast.success("User created successfully!");
        setFormData({
          full_name: "",
          username: "",
          password: "",
          phone: "",
          email: "",
          role: "user",
        });
      } else {
        if (response.errors && Array.isArray(response.errors)) {
          response.errors.forEach((err: any) => {
            toast.error(err.message);
          });
        } else {
          toast.error(response.message || "Failed to create user");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} data-testid="user-create-page">
      <div className={styles.glassCard}>
        <h2 data-testid="user-create-heading">Create New User</h2>
        <form data-testid="user-create-form" onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`} data-testid="user-create-full_name-group">
              <label data-testid="user-create-full_name-label">Full Name:</label>
              <input className={styles.inputField} data-testid="user-create-full_name-input" name="full_name" type="text" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup} data-testid="user-create-username-group">
              <label data-testid="user-create-username-label">Username:</label>
              <input className={styles.inputField} data-testid="user-create-username-input" name="username" type="text" value={formData.username} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup} data-testid="user-create-password-group">
              <label data-testid="user-create-password-label">Password:</label>
              <input className={styles.inputField} data-testid="user-create-password-input" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup} data-testid="user-create-phone-group">
              <label data-testid="user-create-phone-label">Phone:</label>
              <input className={styles.inputField} data-testid="user-create-phone-input" name="phone" type="text" value={formData.phone} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} data-testid="user-create-email-group">
              <label data-testid="user-create-email-label">Email:</label>
              <input className={styles.inputField} data-testid="user-create-email-input" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>
          <button className={styles.submitBtn} data-testid="user-create-submit-btn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};
