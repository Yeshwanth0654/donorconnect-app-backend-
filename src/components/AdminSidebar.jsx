import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { label: "Dashboard", to: "/admin", badge: "DB" },
    { label: "Users", to: "/admin/users", badge: "US" },
    { label: "Donations", to: "/admin/donations", badge: "DN" },
    { label: "Requests", to: "/admin/requests", badge: "RQ" },
    { label: "Drives", to: "/admin/drives", badge: "DV" },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">DC</div>
          <div>
            <h2>DonorConnect</h2>
            <p>admin portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            >
              <span className="sidebar-link-badge">{item.badge}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button className="sidebar-logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
