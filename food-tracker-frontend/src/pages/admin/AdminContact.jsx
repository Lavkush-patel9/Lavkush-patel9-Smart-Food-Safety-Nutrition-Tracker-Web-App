import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/contact/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(res.data);
    } catch (err) {
      console.log("Error loading messages:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🔹 send reply
  const sendReply = async (id) => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/contact/reply",
        { id, reply: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Reply sent!");
      setReplyText("");
      fetchMessages();
    } catch (err) {
      console.log(err);
      alert("Reply failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📩 Contact Messages (Admin)</h2>

      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p><b>Name:</b> {msg.name}</p>
            <p><b>Email:</b> {msg.email}</p>
            <p><b>Message:</b> {msg.message}</p>
            <p><b>Status:</b> {msg.status || "pending"}</p>

            {msg.reply && (
              <p style={{ color: "green" }}>
                <b>Reply:</b> {msg.reply}
              </p>
            )}

            <textarea
              placeholder="Write reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ width: "100%", marginTop: "10px" }}
            />

            <button
              onClick={() => sendReply(msg.id)}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                background: "blue",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send Reply
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminContact;