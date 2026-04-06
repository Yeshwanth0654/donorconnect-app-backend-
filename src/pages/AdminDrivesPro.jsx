import { useEffect, useState } from "react";
import API, { getApiErrorMessage } from "../api";
import AdminLayout from "../components/AdminLayout";

export default function AdminDrivesPro() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [drives, setDrives] = useState([]);

  const load = () => {
    API.get("/drives").then((res) => setDrives(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const createDrive = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.");
      return;
    }

    try {
      await API.post("/drives", {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        emergency,
        status: "ACTIVE",
      });
      alert("Drive created successfully.");
      setTitle("");
      setDescription("");
      setLocation("");
      setEmergency(false);
      load();
    } catch (error) {
      alert(getApiErrorMessage(error, "Failed to create drive."));
    }
  };

  return (
    <AdminLayout
      title="Community Drives"
      subtitle="Launch campaigns and keep outreach initiatives organized."
    >
      <section className="content-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Campaign Setup</p>
              <h3>Create a new drive</h3>
            </div>
          </div>

          <div className="form-stack">
            <input
              className="admin-input"
              placeholder="Drive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="admin-input admin-textarea"
              placeholder="Describe the purpose, audience, and urgency"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="admin-input"
              placeholder="Location or affected area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={emergency}
                onChange={(e) => setEmergency(e.target.checked)}
              />
              <span>Mark this as an emergency drive</span>
            </label>

            <button className="admin-button admin-button-primary" onClick={createDrive}>
              Publish Drive
            </button>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Library</p>
              <h3>Existing drives</h3>
            </div>
            <span className="panel-meta">{drives.length} active</span>
          </div>

          <div className="stack-list">
            {drives.length > 0 ? (
              drives.map((drive) => (
                <div className="list-card" key={drive.id}>
                  <div className="list-card-row">
                    <strong>{drive.title}</strong>
                    <span className={`status-pill ${drive.emergency ? "warning" : "info"}`}>
                      {drive.emergency ? "Emergency" : "Community"}
                    </span>
                  </div>
                  <p>{drive.description || "No description added yet."}</p>
                  <small>{drive.location || "Location not specified"}</small>
                </div>
              ))
            ) : (
              <div className="empty-state-inline">No drives have been created yet.</div>
            )}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
