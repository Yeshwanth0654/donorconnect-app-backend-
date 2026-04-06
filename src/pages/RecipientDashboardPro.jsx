import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import PortalLayout from "../components/PortalLayout";
import { getCurrentUser } from "../session";

export default function RecipientDashboardPro() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [requests, setRequests] = useState([]);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    if (user.email) {
      API.get("/requests", {
        params: { recipientEmail: user.email },
      }).then((res) => setRequests(res.data));
    }
    API.get("/drives").then((res) => setDrives(res.data));
  }, [user.email]);

  const deliveredCount = requests.filter((request) => request.status === "DELIVERED").length;
  const pendingCount = requests.filter((request) => request.status !== "DELIVERED").length;
  const feedbackCount = requests.filter((request) => request.feedback).length;
  const activeEmergencyDrives = useMemo(
    () => drives.filter((drive) => drive.emergency && drive.status !== "CLOSED"),
    [drives]
  );

  return (
    <PortalLayout
      eyebrow="Recipient Portal"
      title="Request essentials with visibility"
      subtitle="Ask for support, track delivery progress, and share feedback once donations reach you."
      actions={
        <button
          className="admin-button admin-button-primary"
          onClick={() => navigate("/request")}
        >
          Request Items
        </button>
      }
    >
      <section className="stats-grid">
        <article className="metric-card metric-indigo">
          <p>Total Requests</p>
          <strong>{requests.length}</strong>
          <span>Support requests created from your account</span>
        </article>
        <article className="metric-card metric-emerald">
          <p>Delivered</p>
          <strong>{deliveredCount}</strong>
          <span>Requests already fulfilled and delivered</span>
        </article>
        <article className="metric-card metric-amber">
          <p>Feedback Shared</p>
          <strong>{feedbackCount}</strong>
          <span>Delivered requests with follow-up feedback</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Status Board</p>
              <h3>Your latest requests</h3>
            </div>
            <span className="panel-meta">{pendingCount} still in progress</span>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.slice().reverse().slice(0, 6).map((request) => (
                    <tr key={request.id}>
                      <td>{request.itemName}</td>
                      <td>{request.quantity}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{request.feedback || "Pending feedback"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state-cell">
                      No requests submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Emergency Support</p>
              <h3>Urgent active drives</h3>
            </div>
          </div>
          <div className="stack-list">
            {activeEmergencyDrives.length > 0 ? (
              activeEmergencyDrives.map((drive) => (
                <div className="list-card" key={drive.id}>
                  <div className="list-card-row">
                    <strong>{drive.title}</strong>
                    <span className="status-pill warning">Emergency</span>
                  </div>
                  <p>{drive.description}</p>
                  <small>{drive.location || "Location not specified"}</small>
                </div>
              ))
            ) : (
              <div className="empty-state-inline">
                No emergency drives are active right now.
              </div>
            )}
          </div>
        </article>
      </section>
    </PortalLayout>
  );
}

function getStatusClass(status) {
  if (status === "DELIVERED") return "success";
  if (status === "IN_TRANSIT") return "info";
  if (status === "APPROVED") return "neutral";
  return "warning";
}
