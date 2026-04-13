// src/pages/user/UserHistory.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function UserHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW: Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // 🔹 Fetch History
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/api/logs/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setHistory(res.data);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Select one
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 🔥 NEW: Select all
  const handleSelectAll = () => {
    if (selectedIds.length === history.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(history.map((item) => item.id));
    }
  };

  // 🔥 NEW: Delete selected
  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("No items selected");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete selected logs?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://127.0.0.1:5000/api/logs/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );

      setSelectedIds([]);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 NEW: Delete single
  const deleteOne = async (id) => {
    const confirmDelete = window.confirm("Delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/api/logs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Prepare Graph Data
  const chartData = history.map((item, index) => ({
  name:
    item.product_name?.length > 20
      ? item.product_name.slice(0, 20) + "..."
      : item.product_name || `Item ${index + 1}`,

  sugar: Number(item.sugar) || 0,
  calories: Number(item.calories) || 0,
  protein: Number(item.protein) || 0,
}));

  return (
    <div style={{ padding: "30px", background: "#f9fafb", minHeight: "100vh" }}>
      <h2 style={{ color: "#2563eb" }}>📜 User History</h2>

      {/* 🔹 Loading */}
      {loading && <p>Loading...</p>}

      {!loading && history.length === 0 && <p>No history found</p>}

      {/* 🔥 NEW: Select All + Delete */}
      {history.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <button onClick={handleSelectAll}>
            {selectedIds.length === history.length
              ? "Unselect All"
              : "Select All"}
          </button>

          <button
            onClick={deleteSelected}
            style={{
              marginLeft: "10px",
              background: "red",
              color: "white",
              padding: "5px 10px",
            }}
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* 🔥 GRAPH SECTION */}
      {history.length > 0 && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>📊 Nutrition Analysis</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" />
              <Bar dataKey="sugar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 🔥 HISTORY LIST */}
      <div style={{ marginTop: "30px" }}>
        <h3>📦 All Scanned Products</h3>

        {history.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* 🔥 NEW: Checkbox */}
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => handleSelect(item.id)}
            />

            <p><strong>{item.product_name || "Unknown Product"}</strong></p>
            <p>Calories: {item.calories || 0}</p>
            <p>Sugar: {item.sugar || 0}</p>
            <p>Protein: {item.protein || 0}</p>

            {/* 🔥 STATUS BADGE */}
            <p
              style={{
                fontWeight: "bold",
                color:
                  item.health_score >= 80
                    ? "green"
                    : item.health_score >= 60
                    ? "orange"
                    : "red",
              }}
            >
              Score: {item.health_score || "N/A"}
            </p>

            {/* 🔥 NEW: Delete button */}
            <button
              onClick={() => deleteOne(item.id)}
              style={{
                marginTop: "5px",
                background: "crimson",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserHistory;