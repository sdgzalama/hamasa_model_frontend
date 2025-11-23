export default function Topbar() {
  return (
    <div
      style={{
        height: "60px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        position: "fixed",
        top: 0,
        left: "240px",
        right: 0,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
    >
      <h3 style={{ margin: 0 }}>Dashboard</h3>

      <div
        style={{
          width: "35px",
          height: "35px",
          background: "#6E3CBC",
          borderRadius: "50%",
        }}
      ></div>
    </div>
  );
}
