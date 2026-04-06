import { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";

export default function AdminDonations() {

  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/donations")
      .then(res => setData(res.data));
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>
        <h3>All Donations</h3>

        <table className="table">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {data.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.itemName}</td>
                <td>{d.quantity}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}