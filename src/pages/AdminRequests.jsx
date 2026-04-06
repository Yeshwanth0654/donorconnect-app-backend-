import { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";

export default function AdminRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Fetch data
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);

    API.get("/requests")
      .then(res => {
        setRequests(res.data);
      })
      .catch(() => {
        alert("Failed to load requests ❌");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 🚀 Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });

      alert("Status Updated ✅");

      fetchRequests(); // refresh UI

    } catch (err) {
      alert("Update Failed ❌");
    }
  };

  // 🚀 Loading UI
  if (loading) {
    return (
      <div style={{ marginLeft: "240px", padding: "20px" }}>
        <h3>Loading requests...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>

        <h2>Request Management</h2>

        <div className="card p-3 shadow mt-3">

          <table className="table table-hover">

            <thead className="table-dark">
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

                requests.map(r => (
                  <tr key={r.id}>

                    <td>{r.id}</td>
                    <td>{r.itemName}</td>
                    <td>{r.quantity}</td>

                    {/* STATUS BADGE */}
                    <td>
                      <span className={`badge ${
                        r.status === "APPROVED" ? "bg-success" :
                        r.status === "DELIVERED" ? "bg-primary" :
                        "bg-warning"
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateStatus(r.id, "APPROVED")}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-warning btn-sm ms-2"
                        onClick={() => updateStatus(r.id, "DELIVERED")}
                      >
                        Delivered
                      </button>

                    </td>

                  </tr>
                ))

              ) : (

                <tr>
                  <td colSpan="5" className="text-center">
                    No requests available
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}