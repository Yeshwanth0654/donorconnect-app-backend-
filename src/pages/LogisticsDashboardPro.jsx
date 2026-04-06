import { useEffect, useMemo, useState } from "react";
import API, { getApiErrorMessage } from "../api";
import PortalLayout from "../components/PortalLayout";

export default function LogisticsDashboardPro() {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [drives, setDrives] = useState([]);

  const loadData = () => {
    API.get("/requests").then((res) => setRequests(res.data));
    API.get("/donations").then((res) => setDonations(res.data));
    API.get("/drives").then((res) => setDrives(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingDeliveries = requests.filter((request) => request.status !== "DELIVERED");
  const inventory = useMemo(() => {
    return donations.reduce((accumulator, donation) => {
      const key = donation.category || "General";
      accumulator[key] = (accumulator[key] || 0) + Number(donation.quantity || 0);
      return accumulator;
    }, {});
  }, [donations]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}/status`, null, {
        params: { status },
      });
      alert(`Request marked as ${status}.`);
      loadData();
    } catch (error) {
      alert(getApiErrorMessage(error, "Unable to update delivery status."));
    }
  };

  return (
    <PortalLayout
      eyebrow="Logistics Portal"
      title="Coordinate inventory and delivery"
      subtitle="Balance available donations, urgent requests, and transportation status to keep support moving."
    >
      <section className="stats-grid">
        <article className="metric-card metric-indigo">
          <p>Pending Deliveries</p>
          <strong>{pendingDeliveries.length}</strong>
          <span>Requests still moving through the delivery pipeline</span>
        </article>
        <article className="metric-card metric-emerald">
          <p>Inventory Records</p>
          <strong>{donations.length}</strong>
          <span>Donation records currently available to allocate</span>
        </article>
        <article className="metric-card metric-amber">
          <p>Active Drives</p>
          <strong>{drives.filter((drive) => drive.status !== "CLOSED").length}</strong>
          <span>Campaigns requiring transportation and stock planning</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Delivery Queue</p>
              <h3>Request status updates</h3>
            </div>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Next Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.itemName}</td>
                      <td>{request.quantity}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-group">
                          {request.status === "REQUESTED" && (
                            <button
                              className="admin-button admin-button-soft"
                              onClick={() => updateStatus(request.id, "APPROVED")}
                            >
                              Approve
                            </button>
                          )}
                          {request.status !== "DELIVERED" && request.status !== "IN_TRANSIT" && (
                            <button
                              className="admin-button admin-button-soft"
                              onClick={() => updateStatus(request.id, "IN_TRANSIT")}
                            >
                              Dispatch
                            </button>
                          )}
                          {request.status !== "DELIVERED" && (
                            <button
                              className="admin-button admin-button-primary"
                              onClick={() => updateStatus(request.id, "DELIVERED")}
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state-cell">
                      No requests available.
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
              <p className="panel-kicker">Inventory Snapshot</p>
              <h3>Available stock by category</h3>
            </div>
          </div>
          <div className="stack-list">
            {Object.keys(inventory).length > 0 ? (
              Object.entries(inventory).map(([category, quantity]) => (
                <div className="list-card" key={category}>
                  <div className="list-card-row">
                    <strong>{category}</strong>
                    <span className="status-pill info">{quantity} units</span>
                  </div>
                  <p>Use this stock view to plan shipments and assign transportation.</p>
                </div>
              ))
            ) : (
              <div className="empty-state-inline">Inventory data is not available yet.</div>
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
