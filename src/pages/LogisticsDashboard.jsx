import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function LogisticsDashboard() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get("/requests")
      .then(res => setRequests(res.data))
      .catch(() => alert("Failed to load"));
  }, []);

  const markDelivered = async (id) => {
    try {
      await API.put(`/requests/${id}`, { status: "DELIVERED" });
      alert("Marked as Delivered ✅");

      // refresh
      setRequests(requests.map(r =>
        r.id === id ? { ...r, status: "DELIVERED" } : r
      ));

    } catch {
      alert("Error ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2>Logistics Coordinator 🚚</h2>
        <p style={{ color: "gray" }}>
          Manage deliveries and ensure timely distribution
        </p>

        <div className="card p-3 mt-4">

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.itemName}</td>
                  <td>{r.quantity}</td>
                  <td>{r.status}</td>

                  <td>
                    {r.status !== "DELIVERED" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => markDelivered(r.id)}
                      >
                        Deliver
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}