import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

/* ----------------------------------------------------
   TYPE DEFINITIONS
---------------------------------------------------- */

interface MediaSource {
  id: string;
  name: string;
  last_scraped_at: string | null;
}

interface Project {
  id: string;
  name: string;
  client_name: string;
  thematic_areas: string[];
  media_sources: MediaSource[];   // ← project-specific sources
}

/* ----------------------------------------------------
   COMPONENT
---------------------------------------------------- */

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingSourceId, setLoadingSourceId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Fetch all projects (each project already includes its own media sources)
  const loadProjects = async () => {
    const res = await fetch("http://127.0.0.1:8000/projects");
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Auto-clear notifications
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // SCRAPER
  const scrapeSource = async (projectId: string, sourceId: string) => {
    setLoadingSourceId(sourceId);
    setMessage("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/scrape/rss?project_id=${projectId}&source_id=${sourceId}`,
        { method: "POST" }
      );

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(`❌ Scrape failed: ${body?.detail || "Unknown error"}`);
      } else {
        setMessage(`✅ Scrape completed for source: ${sourceId}`);
      }

      loadProjects(); // refresh last_scraped time
    } catch {
      setMessage("❌ Network error during scraping.");
    }

    setLoadingSourceId(null);
  };

  return (
    <MainLayout>
      <h1 style={styles.pageTitle}>Projects</h1>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.container}>
        {projects.map((project) => (
          <div key={project.id} style={styles.projectCard}>
            {/* HEADER */}
            <div style={styles.projectHeader}>
              <div>
                <h2 style={styles.projectTitle}>{project.name}</h2>
                <p style={styles.clientName}>{project.client_name}</p>
              </div>

              <Link to={`/analytics/${project.id}`} style={styles.analyticsButton}>
                View Analytics
              </Link>
            </div>

            {/* THEMATIC AREAS */}
            <div style={styles.sectionHeader}>Thematic Areas</div>
            <div style={styles.themeWrapper}>
              {project.thematic_areas.length === 0 ? (
                <span style={{ opacity: 0.6 }}>No themes added</span>
              ) : (
                project.thematic_areas.map((t, index) => (
                  <span key={index} style={styles.themeBadge}>
                    {t}
                  </span>
                ))
              )}
            </div>

            {/* PROJECT-SPECIFIC MEDIA SOURCES */}
            <div style={styles.sectionHeader}>Media Sources</div>

            {project.media_sources.length === 0 ? (
              <div style={{ opacity: 0.6 }}>No sources linked to this project</div>
            ) : (
              project.media_sources.map((source: MediaSource) => (
                <div key={source.id} style={styles.sourceRow}>
                  <div style={styles.sourceInfo}>
                    <strong>{source.name}</strong>
                    <div style={styles.lastScraped}>
                      {source.last_scraped_at
                        ? `Last scraped: ${new Date(source.last_scraped_at).toLocaleString()}`
                        : "Never scraped"}
                    </div>
                  </div>

                  <button
                    onClick={() => scrapeSource(project.id, source.id)}
                    disabled={loadingSourceId === source.id}
                    style={
                      loadingSourceId === source.id
                        ? styles.scrapeButtonDisabled
                        : styles.scrapeButton
                    }
                  >
                    {loadingSourceId === source.id ? "Scraping…" : "Scrape"}
                  </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

/* ----------------------------------------------------
   INTERNAL CSS
---------------------------------------------------- */

const styles: any = {
  pageTitle: { fontSize: "28px", fontWeight: "bold", marginBottom: "20px" },

  message: {
    padding: "12px",
    background: "#eef2ff",
    borderLeft: "4px solid #6366f1",
    borderRadius: "6px",
    marginBottom: "20px",
    fontWeight: 500,
  },

  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },

  projectCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  projectTitle: { fontSize: "20px", fontWeight: 700 },

  clientName: { color: "#6b7280", marginTop: "2px" },

  analyticsButton: {
    background: "#6D28D9",
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
  },

  sectionHeader: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#4b5563",
    marginTop: "15px",
    marginBottom: "6px",
  },

  themeWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "12px",
  },

  themeBadge: {
    background: "#EDE9FE",
    color: "#5B21B6",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
  },

  sourceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
  },

  sourceInfo: { display: "flex", flexDirection: "column" },

  lastScraped: { fontSize: "12px", color: "#6b7280", marginTop: "2px" },

  scrapeButton: {
    background: "#6D28D9",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  },

  scrapeButtonDisabled: {
    background: "#c4b5fd",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "not-allowed",
    fontSize: "13px",
  },
};
