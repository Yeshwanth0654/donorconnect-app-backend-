import { useEffect, useState } from "react";
import API from "../api";
import AdminLayout from "../components/AdminLayout";

export default function AdminUsersPro() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => alert("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout
        title="User Management"
        subtitle="Review registered accounts and role distribution."
      >
        <div className="panel-card">Loading users...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="User Management"
      subtitle="A structured view of every registered account in the system."
    >
      <section className="panel-card">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Directory</p>
            <h3>All users</h3>
          </div>
          <span className="panel-meta">{users.length} accounts</span>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="status-pill neutral">{user.role}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-state-cell">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
