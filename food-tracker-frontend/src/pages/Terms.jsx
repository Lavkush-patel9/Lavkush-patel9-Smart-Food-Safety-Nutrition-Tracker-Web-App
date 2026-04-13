// src/pages/Terms.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h1>📜 Terms of Use</h1>
        <p>Smart Food Safety & Nutrition Tracker</p>
      </div>

      {/* Content */}
      <div style={styles.card}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using this application, you agree to follow all the rules and
          guidelines mentioned in these Terms of Use.
        </p>

        <h2>2. Proper Use</h2>
        <p>
          This system is designed for educational and health tracking purposes.
          Any misuse of the platform is strictly prohibited.
        </p>

        <h2>3. User Responsibility</h2>
        <p>
          Users are responsible for maintaining the confidentiality of their
          account credentials and data.
        </p>

        <h2>4. Data Accuracy</h2>
        <p>
          The nutritional information provided is based on available data and
          should not be considered medical advice.
        </p>

        <h2>5. System Rights</h2>
        <p>
          We reserve the right to modify or terminate services at any time
          without prior notice.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          We are not responsible for any health issues arising from incorrect
          usage of the information provided.
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

export default Terms;

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