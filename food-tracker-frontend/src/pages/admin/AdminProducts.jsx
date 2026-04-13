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
            <th style={thStyle}>Barcode</th>
            <th style={thStyle}>Calories</th>
            <th style={thStyle}>Carbs</th>
            <th style={thStyle}>Sugar</th>
            <th style={thStyle}>Protein</th>
            <th style={thStyle}>Fat</th>
            <th style={thStyle}>Image_url</th>
            <th style={thStyle}>Ingredient</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.barcode}</td>
              <td style={tdStyle}>{p.calories}</td>
              <td style={tdStyle}>{p.carbs}</td>
              <td style={tdStyle}>{p.sugar}</td>
              <td style={tdStyle}>{p.protein}</td>
              <td style={tdStyle}>{p.fat}</td>
              <td style={tdStyle}>{p.image_url}</td>
              <td style={tdStyle}>{p.ingredients_text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "10px", border: "1px solid #ddd" };
const tdStyle = { padding: "10px", border: "1px solid #ddd" };
