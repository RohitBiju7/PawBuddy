import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInterceptor";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUser(response.data.user);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7FAF9",
        }}
      >
        <div
          style={{
            backgroundColor: "#FDECEA",
            color: "#C0392B",
            padding: "16px 20px",
            borderRadius: "10px",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7FAF9",
          color: "#2F7D6D",
          fontWeight: "600",
        }}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        backgroundColor: "#F7FAF9",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              color: "#2F7D6D",
              marginBottom: "8px",
            }}
          >
            My Profile
          </h1>

          <p
            style={{
              color: "#667570",
              margin: 0,
            }}
          >
            View your PawBuddy account details.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div>
            <strong style={{ color: "#24332F" }}>Name:</strong>
            <div style={{ color: "#667570", marginTop: "4px" }}>
              {user.name}
            </div>
          </div>

          <div>
            <strong style={{ color: "#24332F" }}>Email:</strong>
            <div style={{ color: "#667570", marginTop: "4px" }}>
              {user.email}
            </div>
          </div>

          {user.phone && (
            <div>
              <strong style={{ color: "#24332F" }}>Phone:</strong>
              <div style={{ color: "#667570", marginTop: "4px" }}>
                {user.phone}
              </div>
            </div>
          )}

          <div>
            <strong style={{ color: "#24332F" }}>Role:</strong>
            <div
              style={{
                display: "inline-block",
                marginTop: "6px",
                backgroundColor: "#DCEFE8",
                color: "#2F7D6D",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </div>
          </div>

          {user.isActive !== undefined && (
            <div>
              <strong style={{ color: "#24332F" }}>Account Status:</strong>

              <div
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  backgroundColor: user.isActive ? "#E8F5EF" : "#FDECEA",
                  color: user.isActive ? "#2F7D6D" : "#C0392B",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: "600",
                }}
              >
                {user.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;