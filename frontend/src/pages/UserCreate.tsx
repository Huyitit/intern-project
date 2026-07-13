import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser } from "../api/users";

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
  const navigate = useNavigate();

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
        navigate("/admin/users");
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="user-create">
      <h2>Create New User</h2>
      <Link to="/dashboard">Back to Dashboard</Link>
      <form onSubmit={handleSubmit}>
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
        {/* <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
        <div>
          <label>Phone:</label>
          <input name="phone" type="text" onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create User"}
        </button>
      </form>
    </div>
  );
};
