import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";
// import { IoNotificationsOutline } from "react-icons/io5"; // ✅ Added
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [today, setToday] = useState({});
  const [insight, setInsight] = useState("");
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false); // ✅ Added
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get("http://localhost:5000/api/user/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Profile fetch error:", err));

    axios
      .get("http://localhost:5000/api/logs/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setLogs(data);

        if (data.length > 0) {
          const totalScans = data.length;
          const avg = (f) =>
            (
              data.reduce((sum, i) => sum + (i[f] || 0), 0) / totalScans
            ).toFixed(1);

          setStats({
            totalScans,
            avgCalories: avg("calories"),
            avgSugar: avg("sugar"),
            avgProtein: avg("protein"),
            avgFat: avg("fat"),
            avgCarbs: avg("carbs"),
            avgFiber: avg("fiber"),
            avgSodium: avg("sodium"),
            avgCholesterol: avg("cholesterol"),
            avgCalcium: avg("calcium"),
            avgIron: avg("iron"),
            avgVitaminC: avg("vitamin_c"),
            avgVitaminD: avg("vitamin_d"),
            avgPotassium: avg("potassium"),
          });

          let tip = "";
          if (avg("sugar") > 30)
            tip =
              "⚠️ आपकी sugar intake ज़्यादा है। मीठे खाद्य पदार्थों से थोड़ा परहेज़ करें।";
          else if (avg("protein") < 10)
            tip =
              "💪 अपने आहार में प्रोटीन बढ़ाएँ — अंडे, दालें, या पनीर जोड़ें।";
          else if (avg("calories") < 150)
            tip = "🍽️ Calories कम हैं। अपने भोजन को संतुलित रखें।";
          else tip = "✅ बहुत बढ़िया! आपका nutrition level संतुलित है।";

          setInsight(tip);
        }
      })
      .catch((err) => console.error("Logs fetch error:", err));

    axios
      .get("http://localhost:5000/api/nutrition/today", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setToday(res.data))
      .catch((err) => console.error("Today fetch error:", err));
  }, [navigate]);

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };

  const filteredLogs = logs.filter((log) =>
    log.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = [
    { name: "Calories", value: Number(stats.avgCalories) },
    { name: "Sugar", value: Number(stats.avgSugar) },
    { name: "Protein", value: Number(stats.avgProtein) },
    { name: "Fat", value: Number(stats.avgFat) },
    { name: "Carbs", value: Number(stats.avgCarbs) },
    { name: "Fiber", value: Number(stats.avgFiber) },
    { name: "Sodium", value: Number(stats.avgSodium) },
    { name: "Cholesterol", value: Number(stats.avgCholesterol) },
    { name: "Calcium", value: Number(stats.avgCalcium) },
    { name: "Iron", value: Number(stats.avgIron) },
    { name: "Vitamin C", value: Number(stats.avgVitaminC) },
    { name: "Vitamin D", value: Number(stats.avgVitaminD) },
    { name: "Potassium", value: Number(stats.avgPotassium) },
  ];

  return (
    <div className="dashboard-container">
      {/* ✅ Navbar */}
      {/* / */}
      {/* </header> */}

      <div className="Homebar">
        <h1 className="welcome-text">👋 Welcome, {user.username || "User"}!</h1>
        <p className="subtitle">Your personal nutrition summary 🌿</p>
      </div>

      <div className="stats-grid">
        <div className="card blue">
          <h3>Total Scans</h3>
          <p>{stats.totalScans || 0}</p>
        </div>
        <div className="card orange">
          <h3>Avg Calories</h3>
          <p>{stats.avgCalories || 0}</p>
        </div>
        <div className="card green">
          <h3>Avg Sugar</h3>
          <p>{stats.avgSugar || 0}</p>
        </div>
        <div className="card purple">
          <h3>Avg Protein</h3>
          <p>{stats.avgProtein || 0}</p>
        </div>
      </div>

      <section className="chart-section">
        <h2>📊 Average Nutrition Overview</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {insight && <div className="insight-box">{insight}</div>}

      <section className="table-section">
        <h2>🧾 Recent Scans</h2>
        {filteredLogs.length > 0 ? (
          <div className="table-container">
            <table className="scan-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Calories</th>
                  <th>Sugar (g)</th>
                  <th>Protein (g)</th>
                  <th>Fat (g)</th>
                  <th>Barcode</th>
                  <th>Carbs (g)</th>
                  <th>Fiber (g)</th>
                  <th>Sodium (g)</th>
                  <th>Cholesterol (g)</th>
                  <th>Calcium (g)</th>
                  <th>Iron (g)</th>
                  <th>Vitamin C (g)</th>
                  <th>Vitamin D (g)</th>
                  <th>Potassium (g)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice(0, 10).map((log, i) => (
                  <tr key={i}>
                    <td>{log.product_name}</td>
                    <td>{log.calories?.toFixed(2) || "0.00"}</td>
                    <td>{log.sugar?.toFixed(2) || "0.00"}</td>
                    <td>{log.protein?.toFixed(2) || "0.00"}</td>
                    <td>{log.fat?.toFixed(2) || "0.00"}</td>
                    <td>{log.barcode || "-"}</td>
                    <td>{log.carbs?.toFixed(2) || "0.00"}</td>
                    <td>{log.fiber?.toFixed(2) || "0.00"}</td>
                    <td>{log.sodium?.toFixed(2) || "0.00"}</td>
                    <td>{log.cholesterol?.toFixed(2) || "0.00"}</td>
                    <td>{log.calcium?.toFixed(2) || "0.00"}</td>
                    <td>{log.iron?.toFixed(2) || "0.00"}</td>
                    <td>{log.vitamin_c?.toFixed(2) || "0.00"}</td>
                    <td>{log.vitamin_d?.toFixed(2) || "0.00"}</td>
                    <td>{log.potassium?.toFixed(2) || "0.00"}</td>
                    <td>{new Date(log.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No scans yet.</p>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
