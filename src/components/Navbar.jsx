export default function Navbar() {
  return (
    <nav style={{
      background: "#1e293b",
      color: "white",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h4 style={{ margin: 0 }}>🚀 DonorConnect</h4>

      <button className="btn btn-danger"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}>
        Logout
      </button>
    </nav>
  );
}