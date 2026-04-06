import { useEffect, useState } from "react";
import API, { getApiErrorMessage } from "../api";
import AdminLayout from "../components/AdminLayout";

export default function AdminRequestsPro() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);

    API.get("/requests")
      .then((res) => {
        setRequests(res.data);
      })
      .catch(() => {
        alert("Failed to load requests.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}/status`, null, {
        params: { status },
      });
      alert("Request updated successfully.");
      fetchRequests();
    } catch (error) {
      alert(getApiErrorMessage(error, "Failed to update request."));
    }
  };

  if (loading) {
    return (
      <AdminLayout
        title="Request Management"
        subtitle="Review and progress resource requests."
      >
        <div className="panel-card">Loading requests...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Request Management"
      subtitle="Review demand and move requests through the fulfillment pipeline."
    >
      <section className="panel-card">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Workflow</p>
            <h3>Open requests</h3>
          </div>
          <span className="panel-meta">{requests.length} requests</span>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>#{request.id}</td>
                    <td>{request.itemName}</td>
                    <td>{request.quantity}</td>
                    <td>
                      <span className={`status-pill ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className="admin-button admin-button-soft"
                          onClick={() => updateStatus(request.id, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          className="admin-button admin-button-primary"
                          onClick={() => updateStatus(request.id, "DELIVERED")}
                        >
                          Mark Delivered
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state-cell">
                    No requests available.
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

function getStatusClass(status) {
  if (status === "DELIVERED") return "info";
  if (status === "APPROVED") return "success";
  return "warning";
}
