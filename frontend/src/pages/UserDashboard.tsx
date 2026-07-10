import React from "react";
import { Link } from "react-router-dom";
import { logout, getUser } from "../utils/auth";

export const UserDashboard = () => {
  const user = getUser();

  return (
    <div data-testid="user-dashboard">
      <h2>User Dashboard</h2>
      <p>Welcome, {user?.full_name}</p>
      <nav>
        <ul>
          <li>
            <Link to="/user/profile">View Profile</Link>
          </li>
          <li>
            <Link to="/user/avatar">Upload avatar</Link>
          </li>
        </ul>
      </nav>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
