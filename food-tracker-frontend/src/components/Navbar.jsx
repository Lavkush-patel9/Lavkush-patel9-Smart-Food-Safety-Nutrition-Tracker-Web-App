import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaMoon,
  FaSun,
  FaBars,
  FaSearch,
  FaQrcode,
  FaUser,
} from "react-icons/fa";
import "../components/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 🌙 Dark Mode Toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  // 🔔 Dummy notifications
  const notifications = [
    "Your scan result is ready",
    "Profile updated successfully",
    "New food item added to database",
  ];

  // 🔍 Dummy search (temporary)
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      setSearchResults([
        { id: 1, name: "Apple", image: "/images/apple.png" },
        { id: 2, name: "Banana", image: "/images/banana.png" },
        { id: 3, name: "Oats", image: "/images/oats.png" },
      ]);
    }
  };

  // 🔄 Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".sf-notification-wrapper") &&
        !e.target.closest(".sf-notification-dropdown")
      ) {
        setShowNotifications(false);
      }
      if (!e.target.closest(".sf-search-box")) {
        setSearchResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className={`sf-navbar ${darkMode ? "dark" : ""}`}>
      {/* Left: Title */}
      <div className="sf-nav-left" onClick={() => navigate("/dashboard")}>
        <h2 className="sf-nav-title">Smart Food Tracker</h2>
      </div>

      {/* Center: Search Box */}
      <div className={`sf-nav-center ${showMenu ? "active" : ""}`}>
        <div className="sf-search-box">
          <FaSearch className="sf-search-icon" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="sf-search-results">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="sf-result-item"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Buttons */}
      <div className="sf-nav-right">
        {/* Scan Button */}
        <button
          className="sf-scan-btn"
          onClick={() => navigate("/dashboard/scan")}
        >
          <FaQrcode />
          <span>Scan</span>
        </button>

        {/* Notification Bell */}
        <div className="sf-notification-wrapper">
          <button
            className="sf-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
          </button>
          {showNotifications && (
            <div className="sf-notification-dropdown">
              {notifications.map((note, i) => (
                <div key={i} className="sf-notification-item">
                  {note}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Button */}
        <button
          className="sf-icon-btn"
          onClick={() => navigate("/dashboard/userprofile")}
        >
          <FaUser />
        </button>

        {/* Dark Mode Toggle */}
        <button className="sf-icon-btn" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Mobile Menu */}
        <div className="sf-menu-icon" onClick={() => setShowMenu(!showMenu)}>
          <FaBars />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
