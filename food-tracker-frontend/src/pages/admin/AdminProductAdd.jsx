// frontend/src/pages/admin/AdminProductAdd.jsx
import React, { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    calories: "",
    carbs: "",
    sugar: "",
    protein: "",
    brand: "",
    image_url: "",
    ingredients_text: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const token = localStorage.getItem("token"); // or wherever you store

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/products/add",
        {
          name: form.name,
          barcode: form.barcode,
          calories: form.calories || 0,
          carbs: form.carbs || 0,
          sugar: form.sugar || 0,
          protein: form.protein || 0,
          brand: form.brand,
          image_url: form.image_url,
          ingredients_text: form.ingredients_text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMsg({ type: "success", text: res.data.message || "Product added" });
      setForm({
        name: "",
        barcode: "",
        calories: "",
        carbs: "",
        sugar: "",
        protein: "",
        brand: "",
        image_url: "",
        ingredients_text: "",
      });
    } catch (err) {
      console.error(err);
      const text =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add product";
      setMsg({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Add Product (Admin)</h2>
      {msg && (
        <div
          style={{
            padding: 10,
            background: msg.type === "success" ? "#e6ffed" : "#ffe6e6",
            color: msg.type === "success" ? "#0b6623" : "#7a1a1a",
            marginBottom: 12,
          }}
        >
          {msg.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
            placeholder="Barcode"
          />
          <input
            name="calories"
            value={form.calories}
            onChange={handleChange}
            placeholder="Calories"
          />
          <input
            name="carbs"
            value={form.carbs}
            onChange={handleChange}
            placeholder="Carbs"
          />
          <input
            name="sugar"
            value={form.sugar}
            onChange={handleChange}
            placeholder="Sugar"
          />
          <input
            name="protein"
            value={form.protein}
            onChange={handleChange}
            placeholder="Protein"
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
          />
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <textarea
            name="ingredients_text"
            value={form.ingredients_text}
            onChange={handleChange}
            placeholder="Ingredients"
            rows={4}
          />
          <div style={{ marginTop: 6 }}>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "8px 16px" }}
            >
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
