import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function ProjectAnalytics() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [insight, setInsight] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);

  // -----------------------------
  // LOAD DASHBOARD
  // -----------------------------
  const loadAnalytics = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/project/${id}/dashboard`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // LOAD AI INSIGHTS
  // -----------------------------
  const loadInsights = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/project/${id}/insights/latest`
      );

      if (!res.ok) return setInsight(null);

      const json = await res.json();
      setInsight(json);
    } finally {
      setLoadingInsights(false);
    }
  };

  // -----------------------------
  // GENERATE INSIGHTS
  // -----------------------------
  const generateInsights = async () => {
    await fetch(`http://127.0.0.1:8000/project/${id}/insights/generate`, {
      method: "POST",
    });

    alert("AI is generating insights… refresh shortly.");
    loadInsights();
  };

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    loadAnalytics();
    loadInsights();
  }, [id]);

  if (loading || !data) {
    return (
      <MainLayout>
        <h1>Loading…</h1>
      </MainLayout>
    );
  }

  const { project, stats, themes, relevant_items } = data;

  return (
    <MainLayout>
      {/* HEADER */}
      <Header project={project} generateInsights={generateInsights} />

      {/* STATS */}
      <Stats stats={stats} />

      {/* MAIN GRID */}
      <div style={{ display: "flex", gap: "25px", alignItems: "flex-start" }}>
        <div style={{ width: "60%" }}>
          <RelevantArticles items={relevant_items} />
          <ThemeCoverage themes={themes} />
        </div>

        <InsightPanel insight={insight} loading={loadingInsights} />
      </div>
    </MainLayout>
  );
}

/* --------------------------------------------------
   COMPONENTS
---------------------------------------------------*/

function Header({ project, generateInsights }: any) {
  return (
    <div style={styles.header}>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <div style={styles.headerIcon}>📊</div>

        <div>
          <h1 style={styles.headerTitle}>{project.title}</h1>
          <p style={styles.headerClient}>
            Client: {project.client_name || "Not specified"}
          </p>
        </div>
      </div>

      <button onClick={generateInsights} style={styles.btnPrimary}>
        Generate Insights
      </button>
    </div>
  );
}

function Stats({ stats }: any) {
  return (
    <div style={styles.statsGrid}>
      <StatCard title="Total Media Items" value={stats.total_items} />
      <StatCard title="Analysed" value={stats.extracted_items} />
      <StatCard title="Pending AI" value={stats.awaiting_items} />
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div style={styles.statCard}>
      <h3>{title}</h3>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function RelevantArticles({ items }: any) {
  return (
    <div style={styles.section}>
      <h2>Relevant Articles</h2>

      {items.length === 0 && <p>No relevant articles yet.</p>}

      {items.map((item: any) => (
        <div key={item.id} style={styles.articleCard}>
          <h3 style={{ margin: 0 }}>{item.raw_title}</h3>

          <p style={styles.summary}>{item.analysis_summary}</p>

          <div style={styles.articleMeta}>
            <span>{item.source_name}</span>
            <span>{item.published_at?.split("T")[0]}</span>
            <a href={item.url} target="_blank" style={styles.link}>
              Open
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThemeCoverage({ themes }: any) {
  return (
    <div style={styles.section}>
      <h2>Thematic Area Coverage</h2>

      {themes.length === 0 ? (
        <p>No thematic matches yet.</p>
      ) : (
        themes.map((t: any) => (
          <div key={t.name} style={styles.themeRow}>
            <span>{t.name}</span>
            <strong>{t.count}</strong>
          </div>
        ))
      )}
    </div>
  );
}

function InsightPanel({ insight, loading }: any) {
  return (
    <div style={styles.insightPanel}>
      <h2>AI Insights</h2>

      {loading ? (
        <p>Loading insights…</p>
      ) : !insight || !insight.executive_summary ? (
        <p>No insights available.</p>
      ) : (
        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            color: "#1f2937",
          }}
        >
          {insight.executive_summary}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------
   STYLES
---------------------------------------------------*/
const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
    borderRadius: "12px",
    padding: "20px 25px",
    border: "1px solid #DDD",
    marginBottom: "28px",
  },
  headerIcon: {
    width: "50px",
    height: "50px",
    background: "#6D28D9",
    color: "white",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },
  headerTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
  },
  headerClient: {
    margin: 0,
    color: "#6B7280",
  },
  btnPrimary: {
    background: "#6D28D9",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#6d28d9",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
  },
  statValue: {
    fontSize: "34px",
    margin: 0,
    fontWeight: 700,
  },
  section: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    border: "1px solid #DDD",
  },
  articleCard: {
    padding: "12px",
    borderBottom: "1px solid #EEE",
    marginBottom: "12px",
  },
  summary: {
    color: "#374151",
    lineHeight: 1.4,
  },
  articleMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    opacity: 0.8,
  },
  link: { color: "#6D28D9", textDecoration: "none" },
  themeRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #EEE",
  },
  insightPanel: {
    width: "40%",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #DDD",
    position: "sticky",
    top: "20px",
  },
};
