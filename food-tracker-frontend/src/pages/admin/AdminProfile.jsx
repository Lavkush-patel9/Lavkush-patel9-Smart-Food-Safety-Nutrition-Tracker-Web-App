// frontend/src/pages/admin/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    axios
      .get("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAdmin(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Profile</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold">{admin.name}</h2>
        <p className="text-gray-600">{admin.email}</p>
        <p className="text-gray-500 text-sm">
          Joined:{" "}
          {admin.created_at && new Date(admin.created_at).toLocaleDateString()}
        </p>

        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
