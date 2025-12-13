// food-tracker-frontend/src/pages/user/UserProfile.jsx

import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
  FaTimes,
  FaBars,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../services/api"; // ✅ ye file already hai

const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleEdit = () => setIsEditing(!isEditing);

  // ✅ Fetch user profile from backend automatically
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await API.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Profile load error:", error);
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setUser({
      ...user,
      [name]: files ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("username", user.name);
      formData.append("email", user.email);

      // 👇 अगर user ने नई image चुनी है
      const fileInput = document.querySelector('input[name="profilePic"]');
      if (fileInput && fileInput.files.length > 0) {
        formData.append("profileImage", fileInput.files[0]);
      }

      await API.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile Updated Successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile!");
    }
  };

  const handleNavigation = (path) => {
    if (path === "/login") {
      localStorage.removeItem("token");
    }
    navigate(path);
    setSidebarOpen(false);
  };

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>
        <h2>Menu</h2>
        <ul>
          <li onClick={() => handleNavigation("/dashboard")}>Dashboard</li>
          <li className="disabled">My Scans</li>
          <li onClick={() => handleNavigation("/UserProfile")}>Settings</li>
          <li onClick={() => handleNavigation("/login")}>Logout</li>
        </ul>
      </div>

      {/* Sidebar Toggle */}
      <button className="open-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Profile Card */}
      <div className="profile-card">
        <h2>User Profile</h2>

        <div className="edit-toggle">
          {isEditing ? (
            <button className="save-btn" onClick={handleSubmit}>
              <FaSave /> Save Changes
            </button>
          ) : (
            <button className="edit-btn" onClick={toggleEdit}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <div className="profile-pic-container">
          <img
            src={`http://localhost:5000${user.profile_Image}`}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />

          {isEditing && (
            <label className="upload-label">
              <FaImage /> Upload
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </label>
          )}
        </div>

        {!isEditing && (
          <div className="profile-view">
            <p>
              <FaUser /> <strong>Name:</strong> {user.name}
            </p>
            <p>
              <FaEnvelope /> <strong>Email:</strong> {user.email}
            </p>
            <p>
              <FaLock /> <strong>Role:</strong> {user.role}
            </p>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </div>

            <div className="form-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
