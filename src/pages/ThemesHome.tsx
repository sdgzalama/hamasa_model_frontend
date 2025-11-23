import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function ThemesHome() {
  const [projects, setProjects] = useState([]);

  const load = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/projects");
      const json = await res.json();
      setProjects(json);
    } catch (err) {
      console.error("Error loading projects:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <MainLayout>
      <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "10px" }}>
        Select Project
      </h1>
      <p style={{ marginBottom: "20px", opacity: 0.7 }}>
        Choose a project to edit its thematic areas.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {projects.map((p: any) => (
          <Link
            key={p.id}
            to={`/themes/${p.id}`}
            style={{
              display: "block",
              padding: "16px 18px",
              background: "white",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "18px",
              fontWeight: 600,
              color: "#333",
              textDecoration: "none",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget.style.background = "#f8f4ff");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.background = "white");
            }}
          >
            {p.name}
          </Link>
        ))}
      </div>
    </MainLayout>
  );
}
