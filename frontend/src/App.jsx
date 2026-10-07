import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import PetList from "./pages/pets/PetList";
import PetDetails from "./pages/pets/PetDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CreateStaff from "./pages/admin/CreateStaff";

import StaffDashboard from "./pages/staff/StaffDashboard";
import ManagePets from "./pages/staff/ManagePets";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetails />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-staff"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateStaff />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/pets"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <ManagePets />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;