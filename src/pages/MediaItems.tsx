import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

// import "bootstrap/dist/css/bootstrap.min.css";


export default function MediaItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const updateProgress = (itemsList: any[]) => {
    if (itemsList.length === 0) return setProgress(0);

    const extracted = itemsList.filter((i) => i.analysis_status === "extracted").length;
    const percent = Math.round((extracted / itemsList.length) * 100);
    setProgress(percent);
  };

  const loadItems = async () => {
    const res = await fetch("http://127.0.0.1:8000/media/");
    const json = await res.json();
    setItems(json);
    updateProgress(json);
  };

  useEffect(() => {
    loadItems();
    const interval = setInterval(loadItems, 3000); // auto-refresh every 3s
    return () => clearInterval(interval);
  }, []);
  const analyzeItem = async (mediaId: string) => {
    setLoadingId(mediaId);
    setMessage("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/process/media-item/${mediaId}`,
        { method: "POST" }
      );

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage("❌ " + (body?.detail || "Failed to analyze"));
        return;
      }

      setMessage("✔ Item analyzed successfully");
      await loadItems();
    } catch (err: any) {
      setMessage("❌ Network Error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <MainLayout>
      <h1 style={styles.pageTitle}>Media Items</h1>
      <div style={styles.progressSection}>
        <div style={styles.progressLabel}>
          Analysis Progress: {progress}% 
        </div>

        <div style={styles.progressWrapper}>
          <div style={{ ...styles.progressBar, width: progress + "%" }} />
        </div>
      </div>


      {message && <div style={styles.message}>{message}</div>}

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Source</th>
            <th style={styles.th}>URL</th>
            <th style={styles.th}>Scraped</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={styles.tr}>
              <td style={styles.tdTitle}>{item.raw_title}</td>
              <td style={styles.td}>{item.source_name}</td>
              <td style={styles.tdUrl}>
                <a href={item.url} target="_blank" style={styles.urlLink}>
                  Open
                </a>
              </td>
              <td style={styles.td}>{item.scraped_at}</td>
              <td style={styles.tdStatus}>
                {item.analysis_status === "extracted" ? (
                  <span style={styles.badgeSuccess}>Extracted</span>
                ) : (
                  <span style={styles.badgePending}>Raw</span>
                )}
              </td>
              <td style={styles.td}>
                <button
                    onClick={() => analyzeItem(item.id)}
                    disabled={loadingId === item.id}
                    style={{
                      background: "#6D28D9",
                      color: "white",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {loadingId === item.id ? "Analyzing…" : "Analyze"}
                  </button>
                              <Link
                to={`/media-item/${item.id}`}
                style={{
                  background: "#4F46E5",
                  color: "white",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  marginLeft: "8px",
                  fontSize: "13px",
                }}
              >
                View
              </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}

/* ---------------------------------------------
   Modern Internal CSS (inside component file)
---------------------------------------------- */

const styles: any = {
  progressSection: {
  marginBottom: "25px",
},

progressLabel: {
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "8px",
  color: "#374151",
},

progressWrapper: {
  width: "100%",
  height: "12px",
  background: "#e5e7eb",
  borderRadius: "10px",
  overflow: "hidden",
},

progressBar: {
  height: "100%",
  background: "linear-gradient(90deg,#6D28D9,#8B5CF6)",
  borderRadius: "10px",
  transition: "width 0.4s ease",
},

  pageTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  message: {
    background: "#f3f4f6",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "1px solid #e5e7eb",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  thead: {
    background: "#f9fafb",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },

  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#4b5563",
    fontSize: "14px",
    borderBottom: "1px solid #e5e7eb",
  },

  tr: {
    transition: "background 0.15s ease",
  },

  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },

  tdTitle: {
    padding: "14px 16px",
    fontWeight: 500,
    color: "#111827",
    borderBottom: "1px solid #f3f4f6",
  },

  tdUrl: {
    padding: "14px 16px",
  },

  urlLink: {
    color: "#6366f1",
    fontWeight: 500,
    textDecoration: "none",
  },

  tdStatus: {
    padding: "14px 16px",
  },

  badgeSuccess: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },

  badgePending: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },

  button: {
    background: "#6D28D9",
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "opacity 0.2s",
  },

  buttonDisabled: {
    background: "#a78bfa",
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "not-allowed",
    opacity: 0.7,
  },
};
