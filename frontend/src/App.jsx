import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import PetList from "./pages/pets/PetList";
import PetDetails from "./pages/pets/PetDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CreateStaff from "./pages/admin/CreateStaff";
import ManageComplaints from "./pages/admin/ManageComplaints";

import StaffDashboard from "./pages/staff/StaffDashboard";
import ManagePets from "./pages/staff/ManagePets";

import MyApplications from "./pages/adoptions/MyApplications";
import ManageAdoptions from "./pages/adoptions/ManageAdoptions";

import MyAppointments from "./pages/appointments/MyAppointments";
import ManageAppointments from "./pages/appointments/ManageAppointments";

import MyComplaints from "./pages/complaints/MyComplaints";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetails />} />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
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
            path="/admin/complaints"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageComplaints />
              </ProtectedRoute>
            }
          />

          {/* Staff */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute
                allowedRoles={["staff", "admin"]}
              >
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/pets"
            element={
              <ProtectedRoute
                allowedRoles={["staff", "admin"]}
              >
                <ManagePets />
              </ProtectedRoute>
            }
          />

          {/* Adoption */}
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={["adopter"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-adoptions"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
              >
                <ManageAdoptions />
              </ProtectedRoute>
            }
          />

          {/* Appointments */}
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute allowedRoles={["adopter"]}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-appointments"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
              >
                <ManageAppointments />
              </ProtectedRoute>
            }
          />

          {/* Complaints / Reports */}
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute allowedRoles={["adopter"]}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;