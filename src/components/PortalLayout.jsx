import { useNavigate } from "react-router-dom";
import { clearSession, getCurrentUser } from "../session";

export default function PortalLayout({
  eyebrow,
  title,
  subtitle,
  actions = null,
  children,
}) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <div className="portal-shell">
      <header className="portal-topbar">
        <div>
          <p className="portal-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="portal-subtitle">{subtitle}</p>
        </div>

        <div className="portal-topbar-actions">
          <div className="portal-user-chip">
            <strong>{user.name || user.email || "Current User"}</strong>
            <span>{user.role || "Member"}</span>
          </div>
          {actions}
          <button className="admin-button admin-button-soft" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {children}
    </div>
  );
}
