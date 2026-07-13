import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/auth";
import { setToken, setUser } from "../utils/auth";
import styles from "./Register.module.css";

export const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(formData);
      if (response.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} data-testid="register-page">
      <div className={styles.glassCard}>
        <h2 data-testid="register-heading">Register</h2>
        <form data-testid="register-form" onSubmit={handleRegister}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`} data-testid="register-full_name-group">
              <label data-testid="register-full_name-label">Full Name:</label>
              <input className={styles.inputField} data-testid="register-full_name-input" name="full_name" type="text" onChange={handleChange} required />
            </div>
            <div className={styles.formGroup} data-testid="register-username-group">
              <label data-testid="register-username-label">Username:</label>
              <input className={styles.inputField} data-testid="register-username-input" name="username" type="text" onChange={handleChange} required />
            </div>
            <div className={styles.formGroup} data-testid="register-password-group">
              <label data-testid="register-password-label">Password:</label>
              <input className={styles.inputField} data-testid="register-password-input" name="password" type="password" onChange={handleChange} required />
            </div>
            <div className={styles.formGroup} data-testid="register-phone-group">
              <label data-testid="register-phone-label">Phone:</label>
              <input className={styles.inputField} data-testid="register-phone-input" name="phone" type="text" onChange={handleChange} />
            </div>
            <div className={styles.formGroup} data-testid="register-email-group">
              <label data-testid="register-email-label">Email:</label>
              <input className={styles.inputField} data-testid="register-email-input" name="email" type="email" onChange={handleChange} />
            </div>
          </div>
          <button className={styles.submitBtn} data-testid="register-submit-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
        <p className={styles.loginText} data-testid="register-login-text">
          Already have an account? <a className={styles.loginLink} data-testid="register-login-link" href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};
