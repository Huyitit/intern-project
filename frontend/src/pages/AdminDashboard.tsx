import React from "react";
import { Link } from "react-router-dom";
import { logout, getUser } from "../utils/auth";

export const AdminDashboard = () => {
  const user = getUser();

  return (
    <div data-testid="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.full_name}</p>
      <nav>
        <ul>
          <li>
            <Link to="/admin/users" data-testid="view-users-link">View Users Table</Link>
          </li>
          <li>
            <Link to="/admin/users/create" data-testid="create-user-link">Create New User</Link>
          </li>
        </ul>
      </nav>
      <button data-testid="admin-logout" onClick={logout}>Logout</button>
    </div>
  );
};
