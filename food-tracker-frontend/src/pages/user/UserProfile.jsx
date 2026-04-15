// food-tracker-frontend/src/pages/user/UserProfile.jsx

import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import {
  FaUser, FaEnvelope, FaLock, FaImage, FaEdit, FaSave, FaBirthdayCake, FaHeartbeat,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    health_condition: "none",
    profile_Image: ""
  });

  const navigate = useNavigate();

  const toggleEdit = () => setIsEditing(!isEditing);

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await API.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = Array.isArray(res.data) ? res.data[0] : res.data;
        setUser(userData);
      } catch (error) {
        console.error("Profile load error:", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Change Handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic" && files) {
      setUser({ ...user, profile_Image: URL.createObjectURL(files[0]) });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  // ✅ Submit Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("username", user.name || user.username);
      formData.append("email", user.email);
      formData.append("age", user.age);
      formData.append("health_condition", user.health_condition);

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

      alert("✅ Profile Updated Successfully!");
      setIsEditing(false);
      window.location.reload();

    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert("❌ Failed to update profile!");
    }
  };

  // 🔥 FIXED: Logout → HOME PAGE
  const handleNavigation = (path) => {
    if (path === "/login") {
      localStorage.removeItem("token");
      navigate("/", { replace: true }); // ✅ HOME PAGE REDIRECT
      return;
    }

    navigate(path);
  };

  if (!user.email) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">

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
            src={
              user.profile_Image?.startsWith("blob")
                ? user.profile_Image
                : `https://lavkush-patel9-smart-food-safety-wd7y.onrender.com${user.profile_Image}`
            }
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #2563eb",
            }}
          />

          {isEditing && (
            <label className="upload-label">
              <FaImage /> Change Photo
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

        {!isEditing ? (
          <div className="profile-view">
            <p><FaUser /> <strong>Name:</strong> {user.name || user.username}</p>
            <p><FaEnvelope /> <strong>Email:</strong> {user.email}</p>
            <p><FaBirthdayCake /> <strong>Age:</strong> {user.age || "25"}</p>
            <p><FaHeartbeat /> <strong>Condition:</strong> {user.health_condition || "none"}</p>
            <p><FaLock /> <strong>Role:</strong> {user.role}</p>

            {/* 🔥 LOGOUT BUTTON */}
            <div style={{ marginTop: "25px", textAlign: "center" }}>
              <button
                onClick={() => handleNavigation("/login")}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                value={user.name || user.username || ""}
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
                value={user.email || ""}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="form-group">
              <FaBirthdayCake className="icon" />
              <input
                type="number"
                name="age"
                value={user.age || ""}
                onChange={handleChange}
                placeholder="Age"
                required
              />
            </div>

            <div className="form-group">
              <FaHeartbeat className="icon" />
              <select
                name="health_condition"
                value={user.health_condition || "none"}
                onChange={handleChange}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                }}
              >
                <option value="none">Normal / No Issues</option>
                <option value="diabetic">Diabetes</option>
                <option value="high_bp">High Blood Pressure</option>
                <option value="weight_loss">Weight Loss Focus</option>
              </select>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;