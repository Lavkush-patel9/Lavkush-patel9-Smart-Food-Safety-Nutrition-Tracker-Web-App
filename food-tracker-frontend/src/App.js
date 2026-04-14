import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

// 🔹 Public Components
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

// 🔐 Security
import ProtectedRoute from "./components/ProtectedRoute";

// 🔹 Layout
import Layout from "./components/Layout";

// 🔹 User Components
import Dashboard from "./pages/user/UserDashboard";
import ScanPage from "./pages/ScanPage";
import ProfilePage from "./pages/user/UserProfile";
import UserHistory from "./pages/user/UserHistory";
import ProductDetail from "./pages/user/ProductDetail";

// 🔹 Admin Components
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductAdd from "./pages/admin/AdminProductAdd";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminContact from "./pages/admin/AdminContact";

function App() {
  return (
    <BrowserRouter>
      <RoutesWrapper />
      <SpeedInsights />
    </BrowserRouter>
  );
}

function RoutesWrapper() {
  return (
    <Routes>
      {/* 🌍 PUBLIC ROUTES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />

      {/* 👤 USER ROUTES (SAFE + SCALABLE) */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="userprofile" element={<ProfilePage />} />
        <Route path="history" element={<UserHistory />} />
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>

      {/* ⚙️ ADMIN ROUTES (SAFE GROUPING) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <></>
          </ProtectedRoute>
        }
      />

      {/* 👇 ADMIN PAGES (kept SAME to avoid breaking) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProductAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contact"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminContact />
          </ProtectedRoute>
        }
      />

      {/* ❌ 404 PAGE */}
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
