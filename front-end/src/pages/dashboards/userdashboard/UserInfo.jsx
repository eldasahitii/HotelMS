import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaEdit, FaLock, FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";
import { FaListAlt } from "react-icons/fa";
import { toast } from 'react-toastify';



export default function UserInfo() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formLoading, setFormLoading] = useState(false);

useEffect(() => {
  async function fetchUser() {
    try {
      const meRes = await axios.get("https://localhost:7117/api/Auth/me", {
        withCredentials: true,
      });

      const userId = meRes.data.userID;  
      if (!userId) throw new Error("User ID not found");

      const userRes = await axios.get(
        `https://localhost:7117/api/User?id=${userId}`,
        { withCredentials: true }
      );

      setUser(userRes.data);
      setProfileData({
        firstName: userRes.data.firstName || "",
        lastName: userRes.data.lastName || "",
        email: userRes.data.email || "",
      });
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  fetchUser();
}, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast.error("First name, last name, and email are required.");
      return;
    }

    setFormLoading(true);
    try {
      await axios.put(
        `https://localhost:7117/api/User/updateUser?id=${user.userID}`,
        profileData,
        { withCredentials: true }
      );
      toast.success("Profile updated successfully.");
      setUser((prev) => ({ ...prev, ...profileData }));
      setEditProfileMode(false);
    } catch (err) {
      toast.error(err.response?.data?.title || "Update failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setFormLoading(true);
    try {
      await axios.post(
        `https://localhost:7117/api/Auth/changePassword?UserID=${user.userID}`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password changed successfully.");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordMode(false);
    } catch (err) {
      toast.error(err.response?.data?.title || "Password update failed");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading user info...</p>;

  if (!user) return <p className="text-center mt-5">Error: user data not loaded.</p>;

return (
  <div
    className="container d-flex flex-column align-items-center justify-content-center min-vh-100"
    style={{ gap: "1.5rem" }}
  >
    <div
      className="card shadow p-5 w-100"
      style={{ maxWidth: "700px", fontSize: "1.1rem" }}
    >
      <h4 className="text-center mb-4">
        <FaUser className="me-2" />
        My Profile
      </h4>

      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <FaExclamationCircle className="me-2" />
          {error}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          {successMsg}
        </div>
      )}

      {!editProfileMode && !changePasswordMode && (
        <div>
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <FaEnvelope className="me-2" />
            <strong>Email:</strong> {user.email}
          </p>

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditProfileMode(true);
                setChangePasswordMode(false);
                setError("");
                setSuccessMsg("");
              }}
            >
              <FaEdit className="me-2" />
              Edit Profile
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setChangePasswordMode(true);
                setEditProfileMode(false);
                setError("");
                setSuccessMsg("");
              }}
            >
              <FaLock className="me-2" />
              Change Password
            </button>
          </div>
        </div>
      )}

      {editProfileMode && (
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-3">
            <label>First Name</label>
            <input
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="form-control"
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              disabled={formLoading}
              type="submit"
              className="btn btn-success"
            >
              {formLoading ? "Updating..." : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditProfileMode(false);
                setProfileData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                });
              }}
            >
              <FaTimes className="me-1" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {changePasswordMode && (
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label>Old Password</label>
            <input
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>New Password</label>
            <input
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="form-control"
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              disabled={formLoading}
              type="submit"
              className="btn btn-success"
            >
              {formLoading ? "Updating..." : "Change"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setChangePasswordMode(false);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
            >
              <FaTimes className="me-1" />
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>

    <button
      className="btn btn-success d-flex align-items-center"
      onClick={() => navigate("/user/userroomreservation")}
    >
      <FaListAlt className="me-2" />
      My Reservations
    </button>
  </div>
);

}
