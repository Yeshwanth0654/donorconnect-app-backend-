import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/AdminLayout";

export default function AdminPanelPro() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get("/admin/users").then((res) => setUsers(res.data));
    API.get("/donations").then((res) => setDonations(res.data));
    API.get("/requests").then((res) => setRequests(res.data));
  }, []);

  const pendingRequests = requests.filter(
    (request) => request.status !== "DELIVERED"
  ).length;

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="A clear overview of users, donations, and demand across the platform."
      actions={
        <button
          className="admin-button admin-button-primary"
          onClick={() => navigate("/admin/drives")}
        >
          Create Drive
        </button>
      }
    >
      <section className="hero-panel">
        <div>
          <p className="hero-kicker">Platform Health</p>
          <h2>Keep supply, requests, and outreach moving together.</h2>
          <p>
            Monitor donation velocity, track pending requests, and launch new
            drives from one operational hub.
          </p>
        </div>
        <div className="hero-orb-grid">
          <div className="hero-orb hero-orb-indigo" />
          <div className="hero-orb hero-orb-amber" />
          <div className="hero-orb hero-orb-emerald" />
        </div>
      </section>

      <section className="stats-grid">
        <article className="metric-card metric-indigo">
          <p>Total Users</p>
          <strong>{users.length}</strong>
          <span>Registered across all roles</span>
        </article>

        <article className="metric-card metric-emerald">
          <p>Total Donations</p>
          <strong>{donations.length}</strong>
          <span>Items currently recorded</span>
        </article>

        <article className="metric-card metric-amber">
          <p>Pending Requests</p>
          <strong>{pendingRequests}</strong>
          <span>Need review or fulfillment</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Recent Activity</p>
              <h3>Newest users</h3>
            </div>
          </div>
          <div className="data-table">
            <div className="data-row data-head">
              <span>Name</span>
              <span>Role</span>
            </div>
            {users.slice(0, 5).map((user) => (
              <div className="data-row" key={user.id}>
                <span>{user.name || user.email}</span>
                <span className="status-pill neutral">{user.role}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Fulfillment</p>
              <h3>Latest requests</h3>
            </div>
          </div>
          <div className="data-table">
            <div className="data-row data-head">
              <span>Item</span>
              <span>Status</span>
            </div>
            {requests.slice(0, 5).map((request) => (
              <div className="data-row" key={request.id}>
                <span>{request.itemName}</span>
                <span className={`status-pill ${getStatusClass(request.status)}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}

function getStatusClass(status) {
  if (status === "DELIVERED") return "info";
  if (status === "APPROVED") return "success";
  return "warning";
}
