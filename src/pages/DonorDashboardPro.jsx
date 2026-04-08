import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import PortalLayout from "../components/PortalLayout";
import { getCurrentUser } from "../session";

export default function DonorDashboardPro() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [donations, setDonations] = useState([]);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    API.get("/donations").then((res) => setDonations(res.data));
    API.get("/drives").then((res) => setDrives(res.data));
  }, []);

  const myDonations = useMemo(
    () =>
      donations.filter(
        (donation) =>
          user.email &&
          donation.donorEmail &&
          donation.donorEmail.toLowerCase() === user.email.toLowerCase()
      ),
    [donations, user.email]
  );

  const totalQuantity = myDonations.reduce(
    (sum, donation) => sum + Number(donation.quantity || 0),
    0
  );
  const emergencyCount = myDonations.filter((donation) => donation.emergencyDrive).length;
  const activeDrives = drives.filter((drive) => drive.status !== "CLOSED");

  return (
    <PortalLayout
      eyebrow="Donor Portal"
      title="Make every donation count"
      subtitle="Track your contribution history, join emergency campaigns, and support people in need with essentials."
      actions={
        <button
          className="admin-button admin-button-primary"
          onClick={() => navigate("/add")}
        >
          Add Donation
        </button>
      }
    >
      <section className="stats-grid">
        <article className="metric-card metric-indigo">
          <p>Your Donations</p>
          <strong>{myDonations.length}</strong>
          <span>Individual donation records shared through the platform</span>
        </article>
        <article className="metric-card metric-emerald">
          <p>Total Items Contributed</p>
          <strong>{totalQuantity}</strong>
          <span>Total quantity of essentials donated</span>
        </article>
        <article className="metric-card metric-amber">
          <p>Emergency Drives Joined</p>
          <strong>{emergencyCount}</strong>
          <span>Support provided during urgent situations</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Your Activity</p>
              <h3>Recent donations</h3>
            </div>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myDonations.length > 0 ? (
                  myDonations.slice().reverse().slice(0, 6).map((donation) => (
                    <tr key={donation.id}>
                      <td>{donation.itemName}</td>
                      <td>{donation.category || "General"}</td>
                      <td>{donation.quantity}</td>
                      <td>
                        <span className="status-pill success">
                          {donation.status || "RECEIVED"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state-cell">
                      No donations found for this donor yet.
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
              <p className="panel-kicker">Campaigns</p>
              <h3>Active drives</h3>
            </div>
          </div>
          <div className="stack-list">
            {activeDrives.length > 0 ? (
              activeDrives.map((drive) => (
                <div className="list-card" key={drive.id}>
                  <div className="list-card-row">
                    <strong>{drive.title}</strong>
                    <span className={`status-pill ${drive.emergency ? "warning" : "info"}`}>
                      {drive.emergency ? "Emergency" : "Community"}
                    </span>
                  </div>
                  <p>{drive.description}</p>
                  <small>{drive.location || "Location not specified"}</small>
                </div>
              ))
            ) : (
              <div className="empty-state-inline">No active drives available.</div>
            )}
          </div>
        </article>
      </section>
    </PortalLayout>
  );
}
