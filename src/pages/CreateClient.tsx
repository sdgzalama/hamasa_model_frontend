import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function CreateClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submitForm = async () => {
    await fetch("http://127.0.0.1:8000/clients/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact_email: email }),
    });

    alert("Client created successfully!");
  };

  return (
    <MainLayout>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Create Client</h1>

      <div style={{ maxWidth: "400px", marginTop: "20px" }}>
        <label>Name</label>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button style={btnStyle} onClick={submitForm}>
          Create Client
        </button>
      </div>
    </MainLayout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "15px",
};

const btnStyle = {
  padding: "10px 20px",
  background: "#6D28D9",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
