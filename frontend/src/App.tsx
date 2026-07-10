import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { Profile } from "./pages/Profile";
import { UserList } from "./pages/UserList";
import { UserCreate } from "./pages/UserCreate";
import { UserDetail } from "./pages/UserDetail";
import { AvatarUpload } from "./pages/AvatarUpload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/users/create" element={<UserCreate />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/avatar" element={<AvatarUpload />} />
        </Route>

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </BrowserRouter>
  );
}

export default App;
