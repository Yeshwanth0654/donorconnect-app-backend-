import { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";

export default function AdminPanel() {

  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get("/admin/users").then(res => setUsers(res.data));
    API.get("/donations").then(res => setDonations(res.data));
    API.get("/requests").then(res => setRequests(res.data));
  }, []);

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{
        marginLeft: "220px",
        padding: "30px",
        width: "100%",
        background: "#f1f5f9",
        minHeight: "100vh"
      }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2>📊 Admin Dashboard</h2>
            <p style={{ color: "gray" }}>Platform overview & control</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => window.location.href="/admin/drives"}
          >
            + Create Drive
          </button>
        </div>

        {/* STATS */}
        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card p-4 text-white" style={{
              background: "linear-gradient(135deg,#6366f1,#4f46e5)"
            }}>
              <h6>Total Users</h6>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 text-white" style={{
              background: "linear-gradient(135deg,#10b981,#059669)"
            }}>
              <h6>Total Donations</h6>
              <h2>{donations.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 text-dark" style={{
              background: "linear-gradient(135deg,#facc15,#eab308)"
            }}>
              <h6>Pending Requests</h6>
              <h2>{requests.filter(r => r.status !== "DELIVERED").length}</h2>
            </div>
          </div>

        </div>

        {/* TABLE SECTION */}
        <div className="row mt-4">

          <div className="col-md-6">
            <div className="card p-3">
              <h5>👤 Recent Users</h5>
              <table className="table table-hover">
                <tbody>
                  {users.slice(0,5).map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3">
              <h5>📦 Recent Requests</h5>
              <table className="table table-hover">
                <tbody>
                  {requests.slice(0,5).map(r => (
                    <tr key={r.id}>
                      <td>{r.itemName}</td>
                      <td>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}