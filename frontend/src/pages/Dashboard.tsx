import React from "react";
import { Link } from "react-router-dom";
import { logout, getUser } from "../utils/auth";

export const Dashboard = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <div data-testid="dashboard">
      <h2>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</h2>
      <p>Welcome, {user?.full_name}</p>
      
      <nav>
        <ul>
          {/* Admin exclusive links */}
          {isAdmin && (
            <>
              <li>
                <Link to="/admin/users" data-testid="view-users-link">Manage Users Table</Link>
              </li>
              <li>
                <Link to="/admin/users/create" data-testid="create-user-link">Create New User</Link>
              </li>
            </>
          )}

          {/* Shared self-service links */}
          <li>
            <Link to="/profile">View/Edit Profile</Link>
          </li>
          <li>
            <Link to="/avatar">Upload Avatar</Link>
          </li>
        </ul>
      </nav>
      
      <button data-testid="logout" onClick={logout}>Logout</button>
    </div>
  );
};
