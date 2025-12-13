import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("Login response:", res.data);

      // ✅ Get token & role safely
      const token = res.data.token;
      const role = res.data.user?.role || res.data.role;

      // ✅ Store them
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setEmail("");
      setPassword("");
      setError("");

      // ✅ Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <p
        onClick={() => navigate("/signup")}
        style={{ cursor: "pointer", marginTop: 10 }}
      >
        Create an account
      </p>
    </div>
  );
}

export default Login;
