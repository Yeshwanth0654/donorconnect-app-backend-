import { useNavigate } from "react-router-dom";

export default function Sidebar() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "20px",
      position: "fixed"
    }}>

      <h4 style={{ marginBottom: "30px" }}>DonorConnect</h4>

      <ul style={{ listStyle: "none", padding: 0 }}>

        {/* COMMON DASHBOARD */}
        <li
          style={menuItem}
          onClick={() => {
            if (role === "ADMIN") navigate("/admin");
            else if (role === "DONOR") navigate("/donor");
            else if (role === "RECIPIENT") navigate("/recipient");
            else if (role === "LOGISTICS") navigate("/logistics");
          }}
        >
          📊 Dashboard
        </li>

        {/* ADMIN MENU */}
        {role === "ADMIN" && (
          <>
            <li style={menuItem} onClick={() => navigate("/admin/users")}>
              👤 Users
            </li>

            <li style={menuItem} onClick={() => navigate("/admin/donations")}>
              🎁 Donations
            </li>

            <li style={menuItem} onClick={() => navigate("/admin/requests")}>
              📦 Requests
            </li>

            <li style={menuItem} onClick={() => navigate("/admin/drives")}>
              🎯 Drives
            </li>
          </>
        )}

        {/* DONOR MENU */}
        {role === "DONOR" && (
          <>
            <li style={menuItem} onClick={() => navigate("/add")}>
              ➕ Add Donation
            </li>

            <li style={menuItem} onClick={() => navigate("/drives")}>
              📢 View Drives
            </li>
          </>
        )}

        {/* RECIPIENT MENU */}
        {role === "RECIPIENT" && (
          <>
            <li style={menuItem} onClick={() => navigate("/request")}>
              📦 Request Items
            </li>
          </>
        )}

        {/* LOGISTICS MENU (NEW 🔥) */}
        {role === "LOGISTICS" && (
          <>
            <li style={menuItem} onClick={() => navigate("/logistics")}>
              🚚 Manage Deliveries
            </li>
          </>
        )}

      </ul>

      {/* LOGOUT BUTTON */}
      <button
        className="btn btn-danger mt-4"
        onClick={logout}
        style={{ width: "100%" }}
      >
        Logout
      </button>

    </div>
  );
}

// 🔥 COMMON STYLE
const menuItem = {
  padding: "10px",
  cursor: "pointer",
  borderRadius: "8px",
  marginBottom: "10px"
};