import { useState } from "react";
import API from "../api";

export default function RequestPage() {

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {

    if (!itemName || !quantity) {
      alert("All fields required ❌");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be positive ❌");
      return;
    }

    try {
      setLoading(true);

      await API.post("/requests", {
        itemName,
        quantity: parseInt(quantity),
        recipientId: 1
      });

      alert("Request Sent ✅");

    } catch (err) {
      alert("Request Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <h3>Request Items</h3>

      <input
        className="form-control mt-2"
        placeholder="Item Name"
        onChange={e => setItemName(e.target.value)}
      />

      <input
        type="number"
        className="form-control mt-2"
        placeholder="Quantity"
        onChange={e => setQuantity(e.target.value)}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>

    </div>
  );
}