import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [today, setToday] = useState({});
  const [insight, setInsight] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // 1. Fetch Profile
    axios.get("http://localhost:5000/api/user/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // ✅ Array का पहला ऑब्जेक्ट निकालें अगर Backend से Array आ रहा है
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setUser(data);
      })
      .catch((err) => console.error("Profile fetch error:", err));

    // 2. Fetch Logs & Stats
    axios.get("http://localhost:5000/api/logs/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setLogs(data);

        if (data.length > 0) {
          const totalScans = data.length;
          const avg = (f) => (data.reduce((sum, i) => sum + (parseFloat(i[f]) || 0), 0) / totalScans).toFixed(1);

          const currentStats = {
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
          };
          setStats(currentStats);
        }
      })
      .catch((err) => console.error("Logs fetch error:", err));
  }, [navigate]);

  // ✅ NEW: Personalized Insight Feature (यही वो फीचर है जो आपने माँगा है)
  useEffect(() => {
    if (logs.length > 0 && (user.age || user.health_condition)) {
      const age = parseInt(user.age) || 25;
      const condition = user.health_condition || "none";
      const { avgSugar, avgSodium, avgProtein, avgCalories } = stats;
      
      let tips = [];

      // 🍬 Sugar/Diabetes Logic
      if (condition === 'diabetic') {
        if (parseFloat(avgSugar) > 10) tips.push("🚨 DIABETES WARNING: आपकी शुगर (10g) से बहुत ज़्यादा है।");
      } else if (parseFloat(avgSugar) > 30) {
        tips.push("⚠️ HIGH SUGAR: मीठा कम करने की ज़रूरत है।");
      }

      // 🧂 BP Logic
      if (condition === 'high_bp' && parseFloat(avgSodium) > 1500) {
        tips.push("🧂 BP ALERT: नमक की मात्रा कम करें और पानी ज़्यादा पिएं।");
      }

      // 💪 Protein/Age Logic
      if (age > 60 && parseFloat(avgProtein) < 15) {
        tips.push("👴 SENIOR HEALTH: हड्डियों और मांसपेशियों के लिए प्रोटीन बढ़ाएं।");
      } else if (parseFloat(avgProtein) < 10) {
        tips.push("💪 प्रोटीन बढ़ाएं — अंडे, दालें या पनीर जोड़ें।");
      }

      // 🔥 Calorie Logic
      if (age > 50 && parseFloat(avgCalories) > 1800) {
        tips.push("🍽️ AGE FACTOR: इस उम्र में हल्की कैलोरी और सुपाच्य भोजन लें।");
      }

      setInsight(tips.length > 0 ? tips.join(" | ") : "✅ आपकी प्रोफाइल के अनुसार डाइट संतुलित है।");
    }
  }, [logs, user, stats]);

  const filteredLogs = logs.filter((log) =>
    log.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = [
    { name: "Calories", value: Number(stats.avgCalories) || 0 },
    { name: "Sugar", value: Number(stats.avgSugar) || 0 },
    { name: "Protein", value: Number(stats.avgProtein) || 0 },
    { name: "Fat", value: Number(stats.avgFat) || 0 },
    { name: "Carbs", value: Number(stats.avgCarbs) || 0 },
  ];

  return (
    <div className="dashboard-container">
      <div className="Homebar">
        <h1 className="welcome-text">👋 Welcome, {user.name || user.username || "User"}!</h1>
        <p className="subtitle">Profile: <b>{user.health_condition || "Normal"}</b> | Age: <b>{user.age || "N/A"}</b></p>
      </div>

      <div className="stats-grid">
        <div className="card blue"><h3>Total Scans</h3><p>{stats.totalScans || 0}</p></div>
        <div className="card orange"><h3>Avg Calories</h3><p>{stats.avgCalories || 0}</p></div>
        <div className="card green"><h3>Avg Sugar</h3><p>{stats.avgSugar || 0}g</p></div>
        <div className="card purple"><h3>Avg Protein</h3><p>{stats.avgProtein || 0}g</p></div>
      </div>

      {insight && (
        <div className="insight-box" style={{ 
          background: '#fff5f5', borderLeft: '6px solid #e53e3e', padding: '15px', 
          margin: '20px 0', borderRadius: '10px', color: '#c53030', fontWeight: 'bold' 
        }}>
          {insight}
        </div>
      )}

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

      <section className="table-section">
        <h2>🧾 Recent Scans</h2>
        <div className="table-container">
          <table className="scan-table">
            <thead>
              <tr><th>Product</th><th>Calories</th><th>Sugar (g)</th><th>Protein (g)</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filteredLogs.slice(0, 5).map((log, i) => (
                <tr key={i}>
                  <td>{log.product_name}</td>
                  <td>{parseFloat(log.calories).toFixed(1)}</td>
                  <td>{parseFloat(log.sugar).toFixed(1)}</td>
                  <td>{parseFloat(log.protein).toFixed(1)}</td>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
