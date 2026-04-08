import { useEffect, useState } from "react";
import API, { getApiErrorMessage } from "../api";
import PortalLayout from "../components/PortalLayout";
import { getCurrentUser } from "../session";

export default function RequestPagePro() {
  const user = getCurrentUser();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});

  const loadRequests = () => {
    if (!user.email) return;

    API.get("/requests", {
      params: { recipientEmail: user.email },
    }).then((res) => setRequests(res.data));
  };

  useEffect(() => {
    loadRequests();
  }, [user.email]);

  const submit = async () => {
    if (!itemName.trim() || !quantity) {
      alert("Item name and quantity are required.");
      return;
    }

    if (Number(quantity) <= 0) {
      alert("Quantity must be positive.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/requests", {
        itemName: itemName.trim(),
        quantity: parseInt(quantity, 10),
        recipientId: 1,
        recipientEmail: user.email || "recipient@example.com",
      });

      alert("Request submitted successfully.");
      setItemName("");
      setQuantity("");
      loadRequests();
    } catch (error) {
      alert(getApiErrorMessage(error, "Request submission failed."));
    } finally {
      setLoading(false);
    }
  };

  const saveFeedback = async (requestId) => {
    const feedback = feedbackDrafts[requestId]?.trim();

    if (!feedback) {
      alert("Feedback cannot be empty.");
      return;
    }

    try {
      await API.put(`/requests/${requestId}/feedback`, null, {
        params: { feedback },
      });
      alert("Feedback saved successfully.");
      setFeedbackDrafts((current) => ({ ...current, [requestId]: "" }));
      loadRequests();
    } catch (error) {
      alert(getApiErrorMessage(error, "Feedback could not be saved."));
    }
  };

  return (
    <PortalLayout
      eyebrow="Recipient Action"
      title="Request the essentials you need"
      subtitle="Create requests for food, clothing, and other necessities, then add feedback once deliveries arrive."
    >
      <section className="content-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Request Form</p>
              <h3>Create a new request</h3>
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

            <button
              className="admin-button admin-button-primary"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Your Timeline</p>
              <h3>Track and review deliveries</h3>
            </div>
          </div>

          <div className="stack-list">
            {requests.length > 0 ? (
              requests
                .slice()
                .reverse()
                .map((request) => (
                  <div className="list-card" key={request.id}>
                    <div className="list-card-row">
                      <strong>
                        {request.itemName} x {request.quantity}
                      </strong>
                      <span className={`status-pill ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    {request.feedback ? (
                      <p>Feedback: {request.feedback}</p>
                    ) : request.status === "DELIVERED" ? (
                      <div className="feedback-stack">
                        <textarea
                          className="admin-input admin-textarea compact-textarea"
                          placeholder="Share feedback on the donation and delivery experience"
                          value={feedbackDrafts[request.id] || ""}
                          onChange={(e) =>
                            setFeedbackDrafts((current) => ({
                              ...current,
                              [request.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="admin-button admin-button-soft"
                          onClick={() => saveFeedback(request.id)}
                        >
                          Save Feedback
                        </button>
                      </div>
                    ) : (
                      <p>Feedback can be added after delivery.</p>
                    )}
                  </div>
                ))
            ) : (
              <div className="empty-state-inline">
                You have not created any requests yet.
              </div>
            )}
          </div>
        </article>
      </section>
    </PortalLayout>
  );
}

function getStatusClass(status) {
  if (status === "DELIVERED") return "success";
  if (status === "IN_TRANSIT") return "info";
  if (status === "APPROVED") return "neutral";
  return "warning";
}
