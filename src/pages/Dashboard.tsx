import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_items: 0,
    awaiting: 0,
    completed: 0,
  });

  const [latestItems, setLatestItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    done: 0,
    running: false,
  });

  // --------------------------------------
  // AUTO-REFRESH DASHBOARD EVERY 5 SECONDS
  // --------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const statsRes = await fetch("http://127.0.0.1:8000/dashboard/stats").then(r => r.json());
        const itemsRes = await fetch("http://127.0.0.1:8000/media/latest/10").then(r => r.json());

        setStats(statsRes);
        setLatestItems(itemsRes);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setLoading(false);
      }
    }

    load(); // initial load

    const interval = setInterval(() => {
      load();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------
  // PROCESS ALL & LIVE PROGRESS POLL
  // --------------------------------------
  async function handleProcessAll() {
    setProcessing(true);

    await fetch("http://127.0.0.1:8000/media/process/all", {
      method: "POST",
    });

    // POLL PROGRESS
    const interval = setInterval(async () => {
      const res = await fetch("http://127.0.0.1:8000/media/process/progress");
      const data = await res.json();

      setProgress(data);

      if (!data.running) {
        clearInterval(interval);
        setProcessing(false);
        alert("Processing Complete!");

        // force dashboard refresh
        const statsRes = await fetch("http://127.0.0.1:8000/dashboard/stats").then(r => r.json());
        const itemsRes = await fetch("http://127.0.0.1:8000/media/latest/10").then(r => r.json());

        setStats(statsRes);
        setLatestItems(itemsRes);
      }
    }, 700);
  }

  // CALCULATE PROGRESS %
  const progressPercent =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <MainLayout>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "25px" }}>
        Dashboard
      </h1>

      {/* Stats Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <DashboardCard title="Total Projects" value={stats.total_projects} color="#5E2B97" loading={loading} />
        <DashboardCard title="Total Media Items" value={stats.total_items} color="#8A2BE2" loading={loading} />
        <DashboardCard title="Awaiting AI Processing" value={stats.awaiting} color="#A553D6" loading={loading} />
        <DashboardCard title="Completed Extractions" value={stats.completed} color="#C084FC" loading={loading} />
      </div>

      {/* Process all Button */}
      <button
        onClick={handleProcessAll}
        disabled={processing}
        style={{
          padding: "12px 22px",
          background: "#6d28d9",
          color: "white",
          borderRadius: "8px",
          border: "none",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        {processing ? "Processing..." : "Process All Awaiting Items"}
      </button>

      {/* Progress Bar */}
      {processing || progress.running ? (
        <div style={{ marginBottom: "30px", width: "60%" }}>
          <p style={{ marginBottom: "5px", fontWeight: "bold" }}>
            Processing: {progress.done}/{progress.total} ({progressPercent}%)
          </p>

          <div
            style={{
              width: "100%",
              height: "14px",
              background: "#e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "#6d28d9",
                transition: "0.4s ease",
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
          <h3>Media Processing Overview</h3>
          <Bar
            data={{
              labels: ["Awaiting", "Completed"],
              datasets: [
                {
                  label: "Count",
                  backgroundColor: ["#A855F7", "#4ADE80"],
                  data: [stats.awaiting, stats.completed],
                },
              ],
            }}
            height={200}
          />
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
          <h3>Media Items Distribution</h3>
          <Pie
            data={{
              labels: ["Awaiting", "Completed"],
              datasets: [
                {
                  backgroundColor: ["#A855F7", "#4ADE80"],
                  data: [stats.awaiting, stats.completed],
                },
              ],
            }}
            height={200}
          />
        </div>
      </div>

      {/* Latest 10 media items */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
        <h3>Latest 10 Media Items</h3>
        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>Title</th>
              <th style={{ padding: "10px" }}>Source</th>
              <th style={{ padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {latestItems.map((item: any) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{item.title}</td>
                <td style={{ padding: "10px" }}>{item.media_source_name}</td>
                <td style={{ padding: "10px" }}>{item.analysis_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

// -----------------------------------------------------
// SMALL COMPONENTS
// -----------------------------------------------------

function DashboardCard({ title, value, color, loading }: any) {
  if (loading) return <SkeletonCard />;

  return (
    <div
      style={{
        background: color,
        padding: "25px",
        borderRadius: "14px",
        color: "white",
        boxShadow: "0 3px 7px rgba(0,0,0,0.15)",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "38px", fontWeight: "bold", marginTop: "10px" }}>{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        padding: "25px",
        borderRadius: "14px",
        background: "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        height: "150px",
      }}
    ></div>
  );
}
