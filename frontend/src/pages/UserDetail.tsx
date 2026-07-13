import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, deleteUser } from "../api/users";
import { type User } from "../types";
import { toast } from "react-toastify";
import styles from "./UserDetail.module.css";

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

  if (loading) return <div data-testid="user-detail-loading">Loading...</div>;
  if (!user) return <div data-testid="user-detail-notfound">User not found.</div>;

  return (
    <div className={styles.container} data-testid="user-detail-page">
      <div className={styles.glassCard}>
        <h2 data-testid="user-detail-heading">User Detail</h2>
        <div className={styles.infoGroup} data-testid="user-detail-info-group">
          <div className={styles.infoItem}>
            <span className={styles.infoLabel} data-testid="user-detail-id-strong">ID:</span>
            <span className={styles.infoValue} data-testid="user-detail-id-p">{user.id}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel} data-testid="user-detail-username-strong">Username:</span>
            <span className={styles.infoValue} data-testid="user-detail-username-p">{user.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel} data-testid="user-detail-fullname-strong">Full Name:</span>
            <span className={styles.infoValue} data-testid="user-detail-fullname-p">{user.full_name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel} data-testid="user-detail-phone-strong">Phone:</span>
            <span className={styles.infoValue} data-testid="user-detail-phone-p">{user.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel} data-testid="user-detail-email-strong">Email:</span>
            <span className={styles.infoValue} data-testid="user-detail-email-p">{user.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel} data-testid="user-detail-role-strong">Role:</span>
            <span className={styles.infoValue} data-testid="user-detail-role-p">{user.role}</span>
          </div>
        </div>
        <button className={styles.deleteBtn} data-testid="user-detail-delete-btn" onClick={handleDelete}>Delete User</button>
      </div>
    </div>
  );
};
