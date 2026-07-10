import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/auth";
import { setToken, setUser } from "../utils/auth"; // Assume backend could return token on register, or they must login after. API doc says register returns 201 with user. Wait, apiDesign says register just returns user. It does not return token. So we navigate to login.

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
    <div data-testid="register-page">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Full Name:</label>
          <input name="full_name" type="text" onChange={handleChange} required />
        </div>
        <div>
          <label>Username:</label>
          <input name="username" type="text" onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input name="phone" type="text" onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};
