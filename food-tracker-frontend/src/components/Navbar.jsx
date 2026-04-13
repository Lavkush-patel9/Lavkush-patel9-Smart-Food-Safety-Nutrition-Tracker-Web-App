import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaMoon, FaSun, FaQrcode, FaUser } from "react-icons/fa";
import API from "../services/api"; // ✅ Axios service का इस्तेमाल करें
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // ✅ baseURL (127.0.0.1) का उपयोग करें
      const res = await API.get(`/products/search?query=${value.trim()}`);
      setSearchResults(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sf-navbar">
      <div className="sf-nav-left" onClick={() => navigate("/dashboard")}>
        <h2 className="sf-nav-title">SmartFood</h2>
      </div>

      <div ref={searchRef} className="sf-nav-center">
        <input
          type="text"
          placeholder="Search foods..."
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <div className="sf-search-results">
            {searchResults.map((item) => (
              <div key={item.id} className="sf-result-item" onClick={() => {
                navigate(`/dashboard/product/${item.id || item._id}`)
                setSearchResults([]);
                setSearchQuery("");
              }}>
                {/* <img src={item.image_url || "https://placeholder.com"} alt={item.name} /> */}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sf-nav-right">
        <button className="sf-scan-btn" onClick={() => navigate("/dashboard/scan")}>
          <FaQrcode /> <span>Scan</span>
        </button>
        <button className="sf-scan-btn" onClick={() => navigate("/dashboard/history")}>
          <FaQrcode /> <span>ViewHistory</span>
        </button>
        <button className="sf-icon-btn" onClick={() => navigate("/dashboard/userprofile")}>
          <FaUser />
        </button>
        <button className="sf-icon-btn" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
