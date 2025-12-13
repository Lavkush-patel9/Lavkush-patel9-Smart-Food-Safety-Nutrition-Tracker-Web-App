import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role = user
  const [secretKey, setSecretKey] = useState(""); // ✅ added
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // ✅ Send secretKey also if admin selected
      await API.post("/auth/signup", {
        username,
        email,
        password,
        role,
        secretKey: role === "admin" ? secretKey : undefined,
      });

      alert("Signup successful! Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setSecretKey("");
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
        Already have an account
      </p>
    </div>
  );
}

export default Signup;
