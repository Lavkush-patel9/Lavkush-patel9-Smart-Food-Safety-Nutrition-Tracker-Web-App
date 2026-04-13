// src/pages/Contact.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        message: "",
      });

      alert("Message sent successfully!");
    } catch (err) {
      console.log(err.message);
      alert("Failed to send message");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>📩 Contact Us</h1>
        <p>We are here to help you</p>
      </div>

      {/* Form Card */}
      <div style={styles.card}>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              style={styles.textarea}
              required
            />

            <button type="submit" style={styles.button}>
              Send Message
            </button>
          </form>
        ) : (
          <div style={styles.success}>
            ✅ Thank you! Your message has been sent.
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={styles.footer}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

export default Contact;

/* ---------------- STYLES ---------------- */
const styles = {
  container: {
    fontFamily: "Arial",
    padding: "20px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "auto",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  textarea: {
    width: "100%",
    padding: "10px",
    height: "120px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  success: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    fontSize: "18px",
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
  },

  backBtn: {
    padding: "10px 20px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
