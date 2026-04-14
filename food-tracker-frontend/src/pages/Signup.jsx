import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");

  // ✅ New Personalized States
  const [age, setAge] = useState("");
  const [healthCondition, setCondition] = useState("none");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // ✅ API कॉल में अब age और health_condition भी भेजे जा रहे हैं
      await API.post("/auth/signup", {
        username,
        email,
        password,
        role,
        age: parseInt(age),
        health_condition: healthCondition,
        height: parseFloat(height),
        weight: parseFloat(weight),
        goal,
        secretKey: role === "admin" ? secretKey : undefined,
      });

      alert("Signup successful! Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setSecretKey("");
      setAge("");
      setCondition("none");
      setError("");
      navigate("/login");
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={username}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />

        {/* ✅ New Age Field */}
        <label>Age: </label>
        <input
          type="number"
          placeholder="Enter Your Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <br />
        <br />

        <label>Goal: </label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option value="">Select Goal</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <br />
        <br />

        {/* ✅ New Health Condition Dropdown */}
        <label>Health Condition: </label>
        <select
          value={healthCondition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="none">Normal (No Health Issues)</option>
          <option value="diabetic">Diabetes (Sugar Patient)</option>
          <option value="high_bp">High Blood Pressure (BP)</option>
          <option value="weight_loss">Focus on Weight Loss</option>
          <option value="kidney_patient">Kidney Issues</option>
        </select>
        <br />
        <br />

        {/* ✅ Role Dropdown */}
        <label>Select Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <br />
        <br />

        {/* ✅ Secret Key Field (Only for Admin) */}
        {role === "admin" && (
          <>
            <input
              type="text"
              placeholder="Enter Admin Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
            <br />
            <br />
          </>
        )}

        <button type="submit">Signup</button>
      </form>

      <p
        onClick={() => navigate("/login")}
        style={{ cursor: "pointer", marginTop: 10 }}
      >
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;
