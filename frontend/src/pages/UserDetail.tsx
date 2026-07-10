import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUserById, deleteUser } from "../api/users";
import { type User } from "../types";
import { toast } from "react-toastify";

export const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(Number(id));
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          toast.error("User not found");
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await deleteUser(Number(id));
      if (response.success) {
        toast.success("User deleted successfully");
        navigate("/admin/users");
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div data-testid="user-detail">
      <h2>User Detail</h2>
      <Link to="/admin/users">Back to User List</Link>
      <div>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Full Name:</strong> {user.full_name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
};
