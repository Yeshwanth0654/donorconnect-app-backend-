import { useEffect, useState } from "react";
import API from "../api";
import AdminLayout from "../components/AdminLayout";

export default function AdminDonationsPro() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/donations").then((res) => setData(res.data));
  }, []);

  return (
    <AdminLayout
      title="Donations"
      subtitle="Track incoming items and monitor supply volume at a glance."
    >
      <section className="panel-card">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Inventory Flow</p>
            <h3>All donations</h3>
          </div>
          <span className="panel-meta">{data.length} records</span>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((donation) => (
                  <tr key={donation.id}>
                    <td>#{donation.id}</td>
                    <td>{donation.itemName}</td>
                    <td>{donation.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-state-cell">
                    No donations available.
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
