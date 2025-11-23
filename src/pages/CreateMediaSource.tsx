import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function CreateMediaSource() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submitForm = async () => {
    if (!name.trim() || !url.trim()) {
      setMessage("⚠ Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("⏳ Saving...");

    try {
      const res = await fetch("http://127.0.0.1:8000/media-sources/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          base_url: url,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setMessage("✅ Media Source Added Successfully!");
        setName("");
        setUrl("");
      } else {
        setMessage(`❌ Failed: ${json?.detail || "Unknown error"}`);
      }
    } catch (err) {
      setMessage("❌ Network Error");
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Add Media Source
      </h1>

      {message && (
        <div
          style={{
            background: "#eee",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "12px",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ maxWidth: "450px" }}>
        <label>Name</label>
        <input
          style={input}
          value={name}
          placeholder="Example: Mwananchi"
          onChange={(e) => setName(e.target.value)}
        />

        <label>RSS URL</label>
        <input
          style={input}
          value={url}
          placeholder="https://example.com/rss"
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={submitForm}
          disabled={loading}
          style={{
            ...button,
            background: loading ? "#9b72e6" : "#6D28D9",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Add Source"}
        </button>
      </div>
    </MainLayout>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "15px",
};

const button = {
  padding: "12px 20px",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
};
