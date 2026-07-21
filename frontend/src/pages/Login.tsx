import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../api/auth";
import { setToken, setUser } from "../utils/auth";
import styles from "./Login.module.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(username, password);
      console.log("LOGIN RESPONSE", response);
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        toast.success("Login successful!");

        navigate("/dashboard");
      } else {
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((err: any) => toast.error(err.error_message));
        } else {
          console.log("TRIGGERING TOAST ERROR", response.message || "Login failed");
          toast.error(response.message || "Login failed");
        }
      }
    } catch (error: any) {
      console.log("LOGIN ERROR", error);
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} data-testid="login-page">
      <div className={styles.glassCard}>
        <h2 data-testid="login-heading">Login</h2>
        <form data-testid="login-form" onSubmit={handleLogin}>
          <div className={styles.formGroup} data-testid="login-username-group">
            <label data-testid="login-username-label">Username:</label>
            <input
              className={styles.inputField}
              data-testid="login-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.formGroup} data-testid="login-password-group">
            <label data-testid="login-password-label">Password:</label>
            <input
              className={styles.inputField}
              data-testid="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={styles.submitBtn} data-testid="login-submit-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className={styles.registerText} data-testid="login-register-text">
          Don't have an account? <a className={styles.registerLink} data-testid="login-register-link" href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};
