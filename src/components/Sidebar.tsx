import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiDatabase,
  FiLayers,
  FiUserPlus,
  FiFolderPlus,
  FiTool,
  FiPaperclip,
} from "react-icons/fi";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { label: "Dashboard", icon: <FiHome />, path: "/" },
    { label: "Projects", icon: <FiLayers />, path: "/projects" },
    { label: "Media Items", icon: <FiDatabase />, path: "/media" },
    { label: "Add Media Source", icon: <FiDatabase />, path: "/add-media-source" },

    { label: "➕ Create Client", icon: <FiUserPlus />, path: "/clients/new" },
    { label: "➕ Create Project", icon: <FiFolderPlus />, path: "/projects/new" },
    { label: "Edit Thematics", icon: <FiTool />, path: "/themes" },

    // NEW: direct shortcut to media detail (without id)
    // { label: "Media Details", icon: <FiPaperclip />, path: "/media-item" },
  ];

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "#6E3CBC",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "22px" }}>
        🟣 HAMASA
      </h2>
      <p style={{ textAlign: "center", marginTop: "-20px", opacity: 0.7 }}>
        v1.0.0
      </p>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{ textDecoration: "none", color: "white" }}
        >
          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: pathname === item.path ? "#512E89" : "transparent",
              cursor: "pointer",
              fontSize: "16px",
              transition: "0.2s",
            }}
          >
            {item.icon}
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );
}
