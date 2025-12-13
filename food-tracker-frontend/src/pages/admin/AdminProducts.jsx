// frontend/src/pages/admin/AdminLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load products!");
      }
    };
    fetchProducts();
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🍽️ All Products</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Brand</th>
            <th style={thStyle}>Calories</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.brand}</td>
              <td style={tdStyle}>{p.calories}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "10px", border: "1px solid #ddd" };
const tdStyle = { padding: "10px", border: "1px solid #ddd" };
