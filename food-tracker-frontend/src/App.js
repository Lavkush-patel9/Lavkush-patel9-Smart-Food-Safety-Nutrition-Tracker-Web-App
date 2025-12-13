import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔹 Public Components
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// 🔹 User Components
import Dashboard from "./pages/user/UserDashboard";
import ScanPage from "./pages/ScanPage";
import ProfilePage from "./pages/user/UserProfile";

// 🔹 Admin Components
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductAdd from "./pages/admin/AdminProductAdd";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

function MainRoutes() {
  // const navigate = useNavigate();

  // // ✅ Redirect on startup
  // React.useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");

  //   if (token && role === "admin") {
  //     navigate("/admin/dashboard");
  //   } else if (token && role === "user") {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);

  return (
    <Routes>
      {/* 🏠 Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 👤 User Protected Routes (Layout with nested routes) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="userprofile" element={<ProfilePage />} />
      </Route>

      {/* ⚙️ Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute>
            <AdminProductAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute>
            <AdminLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* ❌ 404 Fallback */}
      <Route
        path="*"
        element={
          <h2 style={{ textAlign: "center", marginTop: 50 }}>
            404 - Page Not Found
          </h2>
        }
      />
    </Routes>
  );
}

export default App;
