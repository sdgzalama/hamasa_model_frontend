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

  const API = "https://hamasa-analytics-model.onrender.com";

  // ----------------------------
  // AUTO-REFRESH EVERY 5 SECONDS
  // ----------------------------
  useEffect(() => {
    async function load() {
      try {
        const statsRes = await fetch(`${API}/dashboard/stats`).then(r => r.json());
        const itemsRes = await fetch(`${API}/media/latest/10`).then(r => r.json());

        setStats(statsRes);
        setLatestItems(itemsRes);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
      setLoading(false);
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------
  // PROCESS ALL + LIVE POLLING
  // ----------------------------
  async function handleProcessAll() {
    setProcessing(true);

    await fetch(`${API}/media/process/all`, { method: "POST" });

    const interval = setInterval(async () => {
      const res = await fetch(`${API}/media/process/progress`);
      const data = await res.json();

      setProgress(data);

      if (!data.running) {
        clearInterval(interval);
        setProcessing(false);
        alert("Processing Complete!");

        const statsRes = await fetch(`${API}/dashboard/stats`).then(r => r.json());
        const itemsRes = await fetch(`${API}/media/latest/10`).then(r => r.json());

        setStats(statsRes);
        setLatestItems(itemsRes);
      }
    }, 700);
  }

  const progressPercent =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <MainLayout>
      {/* INTERNAL CSS */}
      <style>{`
        .dash-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .dashboard-card {
          padding: 25px;
          border-radius: 14px;
          color: white;
          box-shadow: 0 3px 7px rgba(0,0,0,0.15);
        }

        .process-btn {
          padding: 12px 22px;
          background: #6d28d9;
          color: white;
          border-radius: 8px;
          border: none;
          margin-bottom: 20px;
          cursor: pointer;
        }

        .progress-bar-bg {
          width: 60%;
          height: 14px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #6d28d9;
          transition: 0.4s ease;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        thead {
          background: #f3f4f6;
        }

        .center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* Title */}
      <h1 className="dash-title">Dashboard</h1>

      {/* Stats */}
      <div className="stats-grid">
        <DashboardCard title="Total Projects" value={stats.total_projects} color="#5E2B97" loading={loading} />
        <DashboardCard title="Total Media Items" value={stats.total_items} color="#8A2BE2" loading={loading} />
        <DashboardCard title="Awaiting AI Processing" value={stats.awaiting} color="#A553D6" loading={loading} />
        <DashboardCard title="Completed Extractions" value={stats.completed} color="#C084FC" loading={loading} />
      </div>

      {/* Process Button */}
      <button onClick={handleProcessAll} disabled={processing} className="process-btn">
        {processing ? "Processing..." : "Process All Awaiting Items"}
      </button>

      {/* Progress Bar */}
      {(processing || progress.running) && (
        <div style={{ marginBottom: "30px" }}>
          <p style={{ marginBottom: "5px", fontWeight: "bold" }}>
            Processing: {progress.done}/{progress.total} ({progressPercent}%)
          </p>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
        <div className="card">
          <h3>Media Processing Overview</h3>
          <Bar
            height={200}
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
          />
        </div>

        <div className="card">
          <h3>Media Items Distribution</h3>
          <Pie
            height={200}
            data={{
              labels: ["Awaiting", "Completed"],
              datasets: [
                {
                  backgroundColor: ["#A855F7", "#4ADE80"],
                  data: [stats.awaiting, stats.completed],
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Latest Media */}
      <div className="card">
        <h3>Latest 10 Media Items</h3>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {latestItems.map((item: any) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.media_source_name}</td>
                <td>{item.analysis_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

function DashboardCard({ title, value, color, loading }: any) {
  if (loading)
    return (
      <div
        style={{
          height: "150px",
          borderRadius: "14px",
          background: "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      ></div>
    );

  return (
    <div className="dashboard-card" style={{ background: color }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "38px", fontWeight: "bold", marginTop: "10px" }}>{value}</p>
    </div>
  );
}
