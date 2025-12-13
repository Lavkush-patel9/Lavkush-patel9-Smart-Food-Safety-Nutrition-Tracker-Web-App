// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalLogs: 0,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // admin info from localStorage (keep same key you store on login)
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  // 📊 Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, prodRes, userRes, logRes] = await Promise.all([
          axios.get("/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/admin/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/admin/logs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
        alert("डेटा लोड करने में समस्या आई है। कृपया दोबारा कोशिश करें।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // 🗑️ Individual Product Delete Function
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("क्या आप इस product को delete करना चाहते हैं?")) return;

    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Product deleted successfully!");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ Failed to delete product.");
    }
  };

  // 🧹 Delete all incomplete (null or unknown) products
  const handleDeleteIncomplete = async () => {
    if (
      !window.confirm(
        "क्या आप सभी incomplete products को delete करना चाहते हैं?"
      )
    )
      return;
    try {
      await axios.delete("/products/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🧹 Incomplete products deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete incomplete products.");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading Dashboard...</p>;

  // 👇 Card Click Handler
  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar (profile + nav) */}
      <div
        style={{
          width: sidebarOpen ? 260 : 60,
          background: "#2c3e50",
          color: "white",
          height: "100vh",
          padding: sidebarOpen ? 20 : 8,
          position: "fixed",
          left: 0,
          top: 0,
          transition: "width 0.25s ease, padding 0.25s ease",
          boxSizing: "border-box",
        }}
      >
        {/* Toggle / Close */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {sidebarOpen ? (
            <>
              <h2 style={{ margin: 0, fontSize: 18 }}>Admin Panel</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ✖
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: 20,
              }}
            >
              ☰
            </button>
          )}
        </div>

        {/* Profile info (visible when open) */}
        {sidebarOpen && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "#34495e",
                margin: "0 auto 10px",
              }}
            />
            <div style={{ fontWeight: "bold" }}>
              {admin?.username || admin?.name || "Admin"}
            </div>
            <div style={{ fontSize: 12, color: "#bdc3c7", marginTop: 4 }}>
              {admin?.email}
            </div>

            <button
              onClick={() => navigate("/admin/profile")}
              style={{
                marginTop: 10,
                background: "#3498db",
                border: "none",
                color: "white",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ✏️ Edit Profile
            </button>

            <hr style={{ margin: "16px 0", borderColor: "#7f8c8d" }} />

            <div style={{ textAlign: "left" }}>
              <div
                style={linkStyle}
                onClick={() => navigate("/admin/dashboard")}
              >
                📊 Dashboard
              </div>
              <div style={linkStyle} onClick={() => navigate("/admin/users")}>
                👥 Users
              </div>
              <div
                style={linkStyle}
                onClick={() => navigate("/admin/products")}
              >
                📦 Products
              </div>
              <div style={linkStyle} onClick={() => navigate("/admin/logs")}>
                📜 Logs
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div style={{ marginLeft: sidebarOpen ? 280 : 80, padding: 20, flex: 1 }}>
        <h1>Admin Dashboard</h1>

        {/* Stats Cards */}
        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          <div
            style={cardStyle}
            onClick={() => handleCardClick("/admin/products")}
          >
            Total Products: {stats.totalProducts}
          </div>
          <div
            style={cardStyle}
            onClick={() => handleCardClick("/admin/users")}
          >
            Total Users: {stats.totalUsers}
          </div>
          <div style={cardStyle} onClick={() => handleCardClick("/admin/logs")}>
            Total Logs: {stats.totalLogs}
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: 300, marginTop: 40 }}>
          <h3>Product Nutrition Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={products.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#82ca9d" name="Calories" />
              <Bar dataKey="sugar" fill="#8884d8" name="Sugar" />
              <Bar dataKey="protein" fill="#ffc658" name="Protein" />
              <Bar dataKey="carbs" fill="gray" name="Carbs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Table */}
        <div style={{ marginTop: 40 }}>
          <h3>All Products</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f3f3" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Brand</th>
                <th style={thStyle}>Calories</th>
                <th style={thStyle}>Carbs</th>
                <th style={thStyle}>Sugar</th>
                <th style={thStyle}>Protein</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.brand}</td>
                  <td style={tdStyle}>{p.calories}</td>
                  <td style={tdStyle}>{p.carbs}</td>
                  <td style={tdStyle}>{p.sugar}</td>
                  <td style={tdStyle}>{p.protein}</td>
                  <td style={tdStyle}>
                    <button
                      style={btnDelete}
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add / Delete buttons */}
        <div style={{ textAlign: "right", marginTop: 20 }}>
          <button
            style={{
              padding: "10px 20px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
            onClick={() => navigate("/admin/add-product")}
          >
            ➕ Add New Product
          </button>
        </div>

        <div style={{ textAlign: "right", marginTop: 20 }}>
          <button
            style={{
              padding: "10px 20px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
            onClick={handleDeleteIncomplete}
          >
            🧹 Delete Incomplete Products
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const linkStyle = {
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
  transition: "0.15s",
  color: "white",
  marginBottom: 8,
};
const cardStyle = {
  flex: 1,
  background: "#dfababff",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontSize: 18,
  fontWeight: "bold",
  cursor: "pointer",
  transition: "transform 0.15s",
};
const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};
const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "center",
};
const btnDelete = {
  padding: "6px 12px",
  background: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
