// src/pages/Privacy.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h1>🔐 Privacy Policy</h1>
        <p>Smart Food Safety & Nutrition Tracker</p>
      </div>

      {/* Content */}
      <div style={styles.card}>
        <h2>1. Information We Collect</h2>
        <p>
          We collect user information like name, email, age, and food scan data
          to provide better health tracking services.
        </p>

        <h2>2. How We Use Data</h2>
        <p>
          Your data is used only for nutrition tracking, health analysis, and
          improving user experience.
        </p>

        <h2>3. Data Security</h2>
        <p>
          We use secure authentication (JWT) and encryption to protect your
          personal information.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell or share your personal data with any third-party
          companies.
        </p>

        <h2>5. User Control</h2>
        <p>
          You can update or delete your data anytime from your profile section.
        </p>
      </div>

      {/* Back Button */}
      <div style={styles.footer}>
        <button onClick={() => navigate("/")} style={styles.button}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

export default Privacy;

/* ---------------- STYLES ---------------- */
const styles = {
  container: {
    fontFamily: "Arial",
    padding: "20px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    margin: "auto",
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
  },

  button: {
    padding: "10px 20px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },
};