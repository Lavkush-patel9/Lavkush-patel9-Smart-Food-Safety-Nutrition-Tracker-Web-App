import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://lavkush-patel9-smart-food-safety-wd7y.onrender.com/api/adminpro/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAdmin(res.data.data);
      } catch (err) {
        console.error("Admin Profile Fetch Error:", err);
        setError("Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [token]);

  // Loading UI
  if (loading) {
    return (
      <div style={styles.center}>
        <h3>Loading Admin Profile...</h3>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div style={styles.center}>
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  // Empty state
  if (!admin) {
    return (
      <div style={styles.center}>
        <h3>No Admin Data Found</h3>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Avatar */}
        <div style={styles.avatar}>
          {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
        </div>

        {/* Name */}
        <h2 style={styles.name}>{admin.name || admin.username || "Admin"}</h2>

        {/* Email */}
        <p style={styles.email}>{admin.email || "No Email Found"}</p>

        {/* Details */}
        <div style={styles.infoBox}>
          <p>
            <b>Role:</b> {admin.role || "Admin"}
          </p>
          <p>
            <b>User ID:</b> {admin.id || "N/A"}
          </p>
          <p>
            <b>Joined:</b>{" "}
            {admin.created_at
              ? new Date(admin.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

/* ================= STYLES ================= */

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "85vh",
    background: "#f5f6fa",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "85vh",
    fontSize: 18,
  },
  card: {
    width: 360,
    padding: 25,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "#3498db",
    color: "#fff",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
    fontWeight: "bold",
  },
  name: {
    margin: "10px 0 5px",
  },
  email: {
    color: "#555",
    marginBottom: 15,
  },
  infoBox: {
    textAlign: "left",
    fontSize: 14,
    lineHeight: 1.8,
    borderTop: "1px solid #eee",
    paddingTop: 10,
  },
};
