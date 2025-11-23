import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function MediaItemDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/media/${id}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error loading media item:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <MainLayout>
        <h1>Loading…</h1>
      </MainLayout>
    );
  }

  const {
    id: mediaId,
    raw_title,
    raw_text,
    source_name,
    url,
    published_at,
    analysis_summary,
    is_relevant,
    matched_thematic_areas = [],
    relevance_results = {},
    ai_fields = {},
  } = data;

  return (
    <MainLayout>
      <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "15px" }}>
        Media Item Detail
      </h1>

      <p style={{ opacity: 0.7, marginBottom: "20px" }}>
        Media ID: <strong>{mediaId}</strong>
      </p>

      {/* =====================
          ARTICLE HEADER
      ===================== */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>{raw_title}</h2>

        <div style={metaRow}>
          <span><strong>Source:</strong> {source_name}</span>
          <span><strong>Date:</strong> {published_at?.split("T")[0]}</span>
          <a href={url} target="_blank" style={linkStyle}>Open Article</a>
        </div>
      </section>

      {/* =====================
          FINAL RELEVANCE
      ===================== */}
      <section style={sectionStyle}>
        <h3>AI Final Relevance</h3>
        <div
          style={{
            padding: "12px",
            background: is_relevant ? "#d1fae5" : "#fee2e2",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          {is_relevant ? "✔ Relevant to Project" : "✖ Not Relevant to Project"}
        </div>
      </section>

      {/* =====================
          AI RELEVANCE DETAILS
      ===================== */}
      <section style={sectionStyle}>
        <h3>AI Relevance Breakdown (Hybrid Decision)</h3>

        {Object.entries(relevance_results).length === 0 ? (
          <p>No relevance results returned.</p>
        ) : (
          Object.entries(relevance_results).map(([projectId, rel]: any) => (
            <div key={projectId} style={cardRow}>
              <strong>Project:</strong> {projectId} <br />

              <div>
                <strong>Relevant:</strong>{" "}
                {rel?.relevant ? "Yes" : "No"} ({rel?.confidence ?? "—"}%)
              </div>

              <div style={{ marginTop: "5px", opacity: 0.8 }}>
                <strong>Reason:</strong> {rel?.reason ?? "No reason provided."}
              </div>
            </div>
          ))
        )}
      </section>

      {/* =====================
          THEMATIC AREAS
      ===================== */}
      <section style={sectionStyle}>
        <h3>Matched Thematic Areas</h3>

        {(matched_thematic_areas?.length ?? 0) === 0 ? (
          <p>No themes matched.</p>
        ) : (
          matched_thematic_areas.map((t: any) => (
            <span key={t.id} style={tag}>
              {t.name}
            </span>
          ))
        )}
      </section>

      {/* =====================
          SUMMARY
      ===================== */}
      <section style={sectionStyle}>
        <h3>AI Summary</h3>
        <p style={{ lineHeight: 1.5 }}>{analysis_summary ?? "No summary available."}</p>
      </section>

      {/* =====================
          AI EXTRACTED FIELDS
      ===================== */}
      <section style={sectionStyle}>
        <h3>AI Extracted Metadata</h3>

        {!ai_fields || Object.keys(ai_fields).length === 0 ? (
          <p>No AI metadata extracted.</p>
        ) : (
          <>
            <TableRow label="Industry">{ai_fields?.industry_name ?? "—"}</TableRow>
            <TableRow label="Tactic">{ai_fields?.industry_tactic ?? "—"}</TableRow>
            <TableRow label="Stakeholders">
              {Array.isArray(ai_fields?.stakeholders)
                ? ai_fields.stakeholders.join(", ")
                : ai_fields?.stakeholders ?? "—"}
            </TableRow>
            <TableRow label="Targeted Policy">{ai_fields?.targeted_policy ?? "—"}</TableRow>
            <TableRow label="Geographical Focus">{ai_fields?.geographical_focus ?? "—"}</TableRow>
            <TableRow label="Outcome / Impact">{ai_fields?.outcome_impact ?? "—"}</TableRow>
          </>
        )}
      </section>

      {/* =====================
          ORIGINAL TEXT
      ===================== */}
      <section style={sectionStyle}>
        <h3>Full Text</h3>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            lineHeight: 1.4,
            background: "#f9fafb",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #eee",
          }}
        >
          {raw_text ?? "No text available."}
        </pre>
      </section>
    </MainLayout>
  );
}

/* ------------------------------
   SMALL COMPONENTS & STYLES
--------------------------------*/

function TableRow({ label, children }: any) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <strong>{label}: </strong>
      <span>{children}</span>
    </div>
  );
}

const sectionStyle: any = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  marginBottom: "25px",
};

const titleStyle: any = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 700,
};

const metaRow: any = {
  display: "flex",
  gap: "20px",
  opacity: 0.8,
  marginTop: "10px",
  fontSize: "14px",
};

const linkStyle: any = {
  color: "#6D28D9",
  textDecoration: "none",
  fontWeight: 600,
};

const cardRow: any = {
  padding: "12px",
  border: "1px solid #eee",
  borderRadius: "10px",
  marginBottom: "10px",
  background: "#f9fafb",
};

const tag: any = {
  display: "inline-block",
  padding: "6px 10px",
  background: "#ede9fe",
  color: "#5b21b6",
  borderRadius: "8px",
  marginRight: "8px",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: 600,
};
