import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function Themes() {
  const { id } = useParams(); // project ID
  const [themes, setThemes] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // Load all thematic areas for this project
  const loadThemes = async () => {
    const res = await fetch(`http://127.0.0.1:8000/project/${id}/thematics`);
    const json = await res.json();
    setProject(json.project);
    setThemes(json.thematic_areas);
  };

  useEffect(() => {
    loadThemes();
  }, [id]);

  // Create new theme
  const addTheme = async () => {
    if (!name.trim()) return alert("Enter a theme name");

    await fetch(`http://127.0.0.1:8000/project/${id}/thematics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc }),
    });

    setName("");
    setDesc("");
    loadThemes();
  };

  // Delete theme (corrected URL)
  const deleteTheme = async (themeId: string) => {
    const ok = confirm("Delete this theme?");
    if (!ok) return;

    await fetch(`http://127.0.0.1:8000/project/thematic/${themeId}`, {
      method: "DELETE",
    });

    loadThemes();
  };

  return (
    <MainLayout>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "15px" }}>
        Edit Thematic Areas
      </h1>

      {!project ? (
        <p>Loading project...</p>
      ) : (
        <p style={{ opacity: 0.7, marginBottom: "25px" }}>
          Project: <strong>{project.name}</strong>
        </p>
      )}

      {/* Create Theme */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "25px",
        }}
      >
        <h3>Add New Thematic Area</h3>

        <input
          placeholder="Theme name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ ...inputStyle, height: "70px" }}
        />

        <button style={buttonStyle} onClick={addTheme}>
          ➕ Add Theme
        </button>
      </div>

      {/* LIST THEMES */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
        }}
      >
        <h3>Existing Themes</h3>

        {themes.length === 0 ? (
          <p>No thematic areas.</p>
        ) : (
          themes.map((t: any) => (
            <div
              key={t.id}
              style={{
                padding: "12px",
                border: "1px solid #eee",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>{t.name}</strong>
              <p style={{ opacity: 0.7 }}>{t.description}</p>

              <button
                onClick={() => deleteTheme(t.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}

const inputStyle: any = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
};

const buttonStyle: any = {
  background: "#6D28D9",
  color: "white",
  padding: "10px 15px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  width: "100%",
  fontWeight: "bold",
  marginTop: "10px",
};
