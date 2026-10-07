import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #DCE7E3",
        padding: "14px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#2F7D6D",
          }}
        >
          PawBuddy
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Link to="/">Home</Link>

        <Link to="/pets">Pets</Link>

        {token && user && (
          <>
            <Link to="/profile">Profile</Link>

            {user.role === "admin" && (
              <>
                <Link to="/admin">Admin Dashboard</Link>
                <Link to="/admin/users">Users</Link>
              </>
            )}

            {user.role === "staff" && (
              <>
                <Link to="/staff">Staff Dashboard</Link>
                <Link to="/staff/pets">Manage Pets</Link>
              </>
            )}

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#F28C7A",
                color: "#FFFFFF",
                border: "none",
                padding: "9px 16px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <Link to="/login">Login</Link>

            <Link
              to="/register"
              style={{
                backgroundColor: "#2F7D6D",
                color: "#FFFFFF",
                padding: "9px 16px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;