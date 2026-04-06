import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  title,
  subtitle,
  actions = null,
  children,
}) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Operations Console</p>
            <h1>{title}</h1>
            {subtitle ? <p className="admin-subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="admin-actions">{actions}</div> : null}
        </header>
        {children}
      </main>
    </div>
  );
}
