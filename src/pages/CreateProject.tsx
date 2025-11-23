import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [clientId, setClientId] = useState("");

  const [clients, setClients] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const [loading, setLoading] = useState(false); // NEW ✔ loading state
  const [message, setMessage] = useState(""); // NEW ✔ message under button

  // -----------------------------------------
  // Load clients + media sources
  // -----------------------------------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/clients/")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch(() => setClients([]));

    fetch("http://127.0.0.1:8000/media-sources/")
      .then((res) => res.json())
      .then((data) => setSources(data))
      .catch(() => setSources([]));
  }, []);

  // -----------------------------------------
  // Submit Form
  // -----------------------------------------
  const submitProject = async () => {
    if (!title.trim() || !clientId) {
      setMessage("⚠️ Project title and client are required.");
      return;
    }

    setLoading(true);
    setMessage("⏳ Creating project… please wait (AI is generating thematic areas)");

    const res = await fetch("http://127.0.0.1:8000/projects/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: desc,
        client_id: clientId,
        media_source_ids: selectedSources,
        category_ids: [],
        collaborator_ids: [],
        report_avenue_ids: [],
        report_time_ids: [],
        report_consultation_ids: [],
      }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("✅ Project created successfully!");
      setTitle("");
      setDesc("");
      setClientId("");
      setSelectedSources([]);
    } else {
      setMessage("❌ Error creating project. Please try again.");
    }
  };

  return (
    <MainLayout>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Create New Project
      </h1>

      <form
        style={{ maxWidth: "500px", marginTop: "10px" }}
        onSubmit={(e) => {
          e.preventDefault();
          submitProject();
        }}
      >
        <label>Project Title</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          style={inputStyle}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <label>Select Client</label>
        <select
          style={inputStyle}
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">-- Select Client --</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Media Sources</label>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
            maxHeight: "180px",
            overflowY: "auto",
            marginBottom: "15px",
          }}
        >
          {sources.length === 0 && <p>No sources found</p>}

          {sources.map((s) => (
            <label
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <input
                type="checkbox"
                value={s.id}
                checked={selectedSources.includes(s.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSources([...selectedSources, s.id]);
                  } else {
                    setSelectedSources(selectedSources.filter((x) => x !== s.id));
                  }
                }}
              />
              {s.name}
            </label>
          ))}
        </div>

        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? "Please Wait…" : "Create Project"}
        </button>

        {message && (
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>
        )}
      </form>
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
  padding: "12px 20px",
  background: "#6D28D9",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
} as const;
