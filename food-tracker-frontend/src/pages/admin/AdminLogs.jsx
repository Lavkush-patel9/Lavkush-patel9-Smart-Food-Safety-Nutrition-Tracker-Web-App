// frontend/src/pages/admin/AdminLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "../../services/api";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/admin/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load logs!");
      }
    };
    fetchLogs();
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h2>📜 All User Scan Logs</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td style={tdStyle}>{l.id}</td>
              <td style={tdStyle}>{l.user_id}</td>
              <td style={tdStyle}>{l.product_name}</td>
              <td style={tdStyle}>{new Date(l.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "10px", border: "1px solid #ddd" };
const tdStyle = { padding: "10px", border: "1px solid #ddd" };
