import { useEffect, useState } from "react";
import API, { getApiErrorMessage } from "../api";
import PortalLayout from "../components/PortalLayout";
import { getCurrentUser } from "../session";

export default function AddDonationPro() {
  const user = getCurrentUser();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("Food");
  const [driveTitle, setDriveTitle] = useState("");
  const [file, setFile] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/drives").then((res) => setDrives(res.data));
  }, []);

  const selectedDrive = drives.find((drive) => drive.title === driveTitle);

  const submit = async () => {
    if (!itemName.trim() || !quantity || Number(quantity) <= 0 || !file) {
      alert("Item name, quantity, and an image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("itemName", itemName.trim());
    formData.append("quantity", quantity);
    formData.append("file", file);
    formData.append("category", category);
    formData.append("donorName", user.name || "Donor");
    formData.append("donorEmail", user.email || "unknown@donor.com");
    formData.append("driveTitle", driveTitle);
    formData.append(
      "emergencyDrive",
      selectedDrive?.emergency ? "true" : "false"
    );

    try {
      setLoading(true);
      await API.post("/donations/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Donation submitted successfully.");
      setItemName("");
      setQuantity("");
      setCategory("Food");
      setDriveTitle("");
      setFile(null);
    } catch (error) {
      alert(getApiErrorMessage(error, "Failed to upload donation."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout
      eyebrow="Donor Action"
      title="List essential items for donation"
      subtitle="Document what you can contribute and map it to ongoing donation drives, especially for emergency response."
    >
      <section className="content-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Donation Form</p>
              <h3>Share an item</h3>
            </div>
          </div>

          <div className="form-stack">
            <input
              className="admin-input"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            <input
              type="number"
              className="admin-input"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <select
              className="admin-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
              <option value="Medical">Medical</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Shelter">Shelter</option>
            </select>

            <select
              className="admin-input"
              value={driveTitle}
              onChange={(e) => setDriveTitle(e.target.value)}
            >
              <option value="">No linked drive</option>
              {drives.map((drive) => (
                <option key={drive.id} value={drive.title}>
                  {drive.title}
                </option>
              ))}
            </select>

            <input
              type="file"
              className="admin-input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button
              className="admin-button admin-button-primary"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Donation"}
            </button>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Drive Match</p>
              <h3>Selected drive summary</h3>
            </div>
          </div>

          {selectedDrive ? (
            <div className="list-card">
              <div className="list-card-row">
                <strong>{selectedDrive.title}</strong>
                <span
                  className={`status-pill ${
                    selectedDrive.emergency ? "warning" : "info"
                  }`}
                >
                  {selectedDrive.emergency ? "Emergency" : "Community"}
                </span>
              </div>
              <p>{selectedDrive.description}</p>
              <small>{selectedDrive.location || "Location not specified"}</small>
            </div>
          ) : (
            <div className="empty-state-inline">
              Choose a drive to connect this donation to a specific campaign.
            </div>
          )}
        </article>
      </section>
    </PortalLayout>
  );
}
