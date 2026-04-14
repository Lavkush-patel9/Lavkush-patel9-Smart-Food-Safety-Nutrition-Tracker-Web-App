// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 🔹 Navbar */}
      <header className="navbar">
        <h1 className="logo"> Smart Food Safety & Nutrition Tracker </h1>
        <nav>
          <ul className="nav-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <span
                onClick={() => navigate("/contact")}
                style={{
                  cursor: "pointer",
                  color: "#00bcd4", // 👈 color added
                  fontWeight: "500",
                }}
              >
                Contact
              </span>
            </li>
            <li>
              <button className="login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* 🔹 Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h2>Track Your Food. Stay Healthy. Stay Smart.</h2>
          <p>
            हमारा सिस्टम आपके भोजन की पौष्टिकता और सुरक्षा को ट्रैक करता है। बस
            स्कैन करें और अपने हेल्थ डेटा को स्मार्ट तरीके से जानें।
          </p>
          <button onClick={() => navigate("/login")} className="cta-btn">
            Get Started
          </button>
        </div>
      </section>

      {/* 🔹 Features Section */}
      <section id="features" className="features">
        <h2>Key Features</h2>
        <div className="feature-cards">
          <div className="card">
            <span>🧠</span>
            <h3>AI Nutrition Detection</h3>
            <p>OCR के ज़रिए भोजन के लेबल से पौष्टिक जानकारी निकालता है।</p>
          </div>

          <div className="card">
            <span>📊</span>
            <h3>Health Dashboard</h3>
            <p>आपके दैनिक भोजन और कैलोरी का रिकॉर्ड रखता है।</p>
          </div>

          <div className="card">
            <span>🧾</span>
            <h3>Safe Food Checker</h3>
            <p>भोजन में मौजूद हानिकारक तत्वों को पहचानता है।</p>
          </div>

          <div className="card">
            <span>👨‍🍳</span>
            <h3>Personalized Suggestions</h3>
            <p>आपके डाइट पैटर्न के अनुसार सुझाव देता है।</p>
          </div>
        </div>
      </section>

      {/* 🔹 About Section */}
      <section id="about" className="about">
        <h2>About Our Project</h2>

        <p className="about-intro">
          <b>Smart Food Safety & Nutrition Tracker</b> एक आधुनिक वेब प्लेटफ़ॉर्म
          है जो आपके भोजन की पौष्टिकता और सुरक्षा को ट्रैक करता है। यह सिस्टम{" "}
          <b>OCR (Optical Character Recognition)</b> तकनीक का उपयोग करके पैक्ड
          फूड लेबल से जानकारी निकालता है और आपको बताता है कि आपका खाना कितना
          स्वस्थ है।
        </p>

        <div className="about-details">
          <h3>How It Works</h3>
          <div className="about-cards">
            <div className="about-card">
              <span>📷</span>
              <h4>
                1. Upload Product Image/Label And Type Manual Barcode Number
              </h4>
              <p>
                आप अपने मोबाइल या कैमरे से किसी भी पैक्ड फूड के लेबल को स्कैन
                करते हैं।
              </p>
            </div>

            <div className="about-card">
              <span>🤖</span>
              <h4>2. OCR Processing</h4>
              <p>
                सिस्टम टेक्स्ट को पहचानकर Nutritional values (Calories, Sugar,
                Protein, Fat, आदि) निकालता है।
              </p>
            </div>

            <div className="about-card">
              <span>💾</span>
              <h4>3. Data Storage</h4>
              <p>
                सारी जानकारी MySQL Database में सुरक्षित रूप से स्टोर होती है।
              </p>
            </div>

            <div className="about-card">
              <span>📊</span>
              <h4>4. Dashboard View</h4>
              <p>
                यूज़र अपने पोषण, स्कैन हिस्ट्री और एनालिटिक्स ग्राफ्स को
                डैशबोर्ड में देख सकता है।
              </p>
            </div>
          </div>
        </div>

        <div className="tech-stack">
          <h3>Technology Stack</h3>
          <div className="tech-grid">
            <div className="tech-card">
              <span>⚛️</span>
              <h4>Frontend</h4>
              <p>React.js, CSS — Clean UI और Responsive Design के लिए।</p>
            </div>
            <div className="tech-card">
              <span>🟢</span>
              <h4>Backend</h4>
              <p>Node.js और Express.js — तेज़ API और Authentication के लिए।</p>
            </div>
            <div className="tech-card">
              <span>🐍</span>
              <h4>OCR Service</h4>
              <p>
                Python (Flask + Tesseract OCR) — Text Extraction और Food Label
                Reading।
              </p>
            </div>
            <div className="tech-card">
              <span>🗄️</span>
              <h4>Database</h4>
              <p>MySQL — Structured Food Data और User Records के लिए।</p>
            </div>
            <div className="tech-card">
              <span>🔐</span>
              <h4>Security</h4>
              <p>
                JWT Token और bcrypt Password Encryption से सुरक्षित
                Authentication।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Call To Action */}
      <section className="cta">
        <h2>आज ही अपना स्वास्थ्य ट्रैक करना शुरू करें!</h2>
        <button onClick={() => navigate("/signup")} className="cta-btn">
          Create Account
        </button>
      </section>

      {/* 🔹 Footer */}
      <footer className="footer">
        <p>© 2025 Smart Food Safety & Nutrition Tracker</p>

        <div className="footer-links">
          <span
            onClick={() => navigate("/privacy")}
            style={{ cursor: "pointer" }}
          >
            Privacy Policy
          </span>

          {" | "}

          <span
            onClick={() => navigate("/terms")}
            style={{ cursor: "pointer" }}
          >
            Terms of Use
          </span>

          {" | "}

          <span
            onClick={() => navigate("/contact")}
            style={{ cursor: "pointer" }}
          >
            Contact Us
          </span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
