import { useState, useEffect } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";

export default function AdminDrives() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [drives, setDrives] = useState([]);

  const load = () => {
    API.get("/drives").then(res => setDrives(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const createDrive = async () => {
    try {
      await API.post("/drives", { title, description });

      alert("Drive Created ✅");
      setTitle("");
      setDescription("");
      load();

    } catch {
      alert("Error ❌");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "220px", padding: "30px", width: "100%" }}>

        <h2>Create Drive</h2>

        <div className="card p-4">

          <input
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button className="btn btn-primary" onClick={createDrive}>
            Create
          </button>

        </div>

        <div className="card p-3 mt-4">
          <h5>All Drives</h5>

          <ul>
            {drives.map(d => (
              <li key={d.id}>{d.title}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}