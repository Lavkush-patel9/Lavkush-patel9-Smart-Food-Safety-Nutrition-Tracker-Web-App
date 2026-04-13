// food-tracker-frontend/src/pages/ScanPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function ScanPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [barcode, setBarcode] = useState("");

  // 🔹 NEW: User Profile State
  const [userProfile, setUserProfile] = useState(null);

  // 🔹 Fetch user profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUserProfile(res.data);
        console.log("👤 User Profile:", res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 File change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  // 🔹 Upload handler
  const handleUpload = async () => {
    if (!image && !barcode) {
      setError("Upload image or enter barcode manually!");
      return;
    }

    setLoading(true);
    const fd = new FormData();
    if (image) fd.append("image", image);
    if (barcode.trim() !== "") fd.append("barcode", barcode);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/ocr/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("📦 Backend Response:", res.data);
      setResult(res.data);
      setError("");

      // 🔹 NEW: Alerts log
      if (res.data.alerts) {
        console.log("⚠ Alerts:", res.data.alerts);
      }
    } catch (err) {
      console.error("❌ Upload Error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch. Please check backend and image quality."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Clear all
  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview("");
    setResult(null);
    setBarcode("");
    setError("");
  };

  // 🔹 Daily recommended limits
  const nutrientLimits = {
    Calories: 2000,
    Sugar: 50,
    Protein: 60,
    Fat: 70,
    Carbs: 300,
    Fiber: 30,
    Sodium: 2300,
    Cholesterol: 300,
    Calcium: 1000,
    Iron: 18,
    VitaminC: 90,
  };

  // 🔹 NEW: Dynamic Limits based on user condition
  const getDynamicLimits = () => {
    let limits = { ...nutrientLimits };

    if (userProfile?.health_conditions) {
      const conditions = userProfile.health_conditions;

      if (conditions.includes("diabetes")) {
        limits.Sugar = 25;
      }

      if (conditions.includes("hypertension")) {
        limits.Sodium = 1500;
      }
    }

    return limits;
  };

  const dynamicLimits = getDynamicLimits();

  // 🔹 Status based on limit
  const getStatus = (key, value) => {
    const limit = dynamicLimits[key];
    if (!limit || isNaN(value)) return { text: "N/A", color: "gray" };
    const percent = (value / limit) * 100;
    if (percent < 30) return { text: "Good", color: "green" };
    if (percent < 70) return { text: "Moderate", color: "orange" };
    return { text: "High", color: "red" };
  };

  // 🔹 Extract product info
  const getProductInfo = () => {
    if (!result) return null;
    const p =
      result.product_info || result.product || result.data || result || {};

    return {
      name: p.name || "Unknown",
      brand: p.brand || "Unknown",
      image_url: p.image_url || p.image || null,
      ingredients: p.ingredients_text || p.ingredients || "Not detected",
      calories: parseFloat(p.calories) || 0,
      sugar: parseFloat(p.sugar) || 0,
      protein: parseFloat(p.protein) || 0,
      carbs: parseFloat(p.carbs) || 0,
      fat: parseFloat(p.fat) || 0,
      fiber: parseFloat(p.fiber) || 0,
      sodium: parseFloat(p.sodium) || 0,
      cholesterol: parseFloat(p.cholesterol) || 0,
      calcium: parseFloat(p.calcium) || 0,
      iron: parseFloat(p.iron) || 0,
      vitamin_c: parseFloat(p.vitamin_c) || 0,
    };
  };

  const product = getProductInfo();

  // 🔹 Personalized Health Score
  // 🔥 FINAL HEALTH SCORE + SUGGESTION SYSTEM

// // 🔥 FINAL HEALTH SCORE
// const healthScore = product ? calculateHealthScore(product) : null;

// // ✅ 🔥 FINAL SUGGESTION FUNCTION
// const suggestion = healthScore !== null ? getFoodSuggestion(healthScore) : null;

// // // ✅ 🔥 NUTRIENT BASED ADVICE
// const adviceList = product ? getNutrientAdvice(product) : [];
const healthScore = result?.health_score ?? null;
const suggestion = result?.suggestion ?? null;
const adviceList = result?.adviceList ?? [];

  // 🔹 UI
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ fontSize: "28px", color: "#2563eb", marginBottom: "20px" }}>
        📷 Scan Food Label
      </h2>

      {/* Upload Section */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "30px",
          width: "100%",
          maxWidth: "600px",
          marginTop: "20px",
        }}
      >
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Enter barcode manually (optional)"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            style={{
              width: "250px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          />
        </div>

        {preview && (
          <div style={{ marginTop: 20 }}>
            <img
              src={preview}
              alt="preview"
              width="250"
              style={{ border: "2px solid #555", borderRadius: 6 }}
            />
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? "gray" : "green",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            {loading ? "Processing..." : "Extract Text"}
          </button>

          <button
            onClick={handleClear}
            style={{
              padding: "10px 20px",
              background: "crimson",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </div>

      {/* Product Info Section */}
      {product && (
        <div
          style={{
            marginTop: "40px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "30px",
            maxWidth: "900px",
            margin: "auto",
            textAlign: "left",
          }}
        >
          {/* 🔹 Alerts UI */}
          {result?.alerts && result.alerts.length > 0 && (
            <div
              style={{
                background: "#fee2e2",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #dc2626",
              }}
            >
              <h4 style={{ color: "#b91c1c" }}>⚠ Health Alerts</h4>
              <ul>
                {result.alerts.map((alert, i) => (
                  <li key={i} style={{ color: "#7f1d1d" }}>
                    {typeof alert === "object" ? alert.message : alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3 style={{ color: "#1e3a8a", marginBottom: "10px" }}>
            📦 Product Info
          </h3>

          {product.image_url && (
            <img
              src={product.image_url}
              alt="Product"
              width="150"
              style={{ marginBottom: 10, borderRadius: 6 }}
            />
          )}

          <p>
            <strong>Name:</strong> {product.name}
          </p>
          {/* <p>
            <strong>Brand:</strong> {product.brand}
          </p> */}
          <p>
            <strong>Ingredients:</strong> {product.ingredients}
          </p>

          <h3 style={{ color: "#1e3a8a", marginTop: "20px" }}>
            🥗 Nutrition Details
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                {["Nutrient", "Value", "Daily Limit", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      background: "#eff6ff",
                      fontWeight: "600",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                "calories",
                "fat",
                "sugar",
                "protein",
                "carbs",
                "fiber",
                "sodium",
                "cholesterol",
                "calcium",
                "iron",
                "vitamin_c",
              ].map((key) => {
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                const value = product[key];
                const limit = dynamicLimits[label] || "N/A";
                const { text, color } = getStatus(label, value);
                const percent =
                  limit && !isNaN(value)
                    ? ((value / limit) * 100).toFixed(1)
                    : "N/A";
                return (
                  <tr key={key}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {label}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {value}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {limit}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color,
                      }}
                    >
                      {text} ({percent}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 style={{ color: "#1e3a8a", marginTop: "25px" }}>
            💯 Overall Health Score
          </h3>
          {healthScore !== null && (
            <p
              style={{
                fontSize: "24px",
                textAlign: "center",
                color:
                  healthScore >= 80
                    ? "#16a34a"
                    : healthScore >= 60
                    ? "#f59e0b"
                    : "#dc2626",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              {healthScore}/100
            </p>
          )}
          {/* ✅ 🔥 ADD THIS HERE */}
          {suggestion && (
            <p style={{ color: suggestion.color, fontWeight: "bold" }}>
              {suggestion.text}
            </p>
          )}

          {/* ✅ 🔥 ADD THIS ALSO */}
          {adviceList.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <h4>💡 Health Advice</h4>
              <ul>
                {adviceList.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScanPage;