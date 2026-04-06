import { useState } from "react";
import API from "../api";

export default function AddDonation() {

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [file, setFile] = useState(null);

  const submit = async () => {

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("quantity", quantity);
    formData.append("file", file);

    try {
      await API.post("/donations/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Uploaded ✅");

    } catch (err) {
      console.log(err);
      alert("Upload Failed ❌");
    }
  };

  return (
    <div className="container mt-4">

      <h3>Add Donation</h3>

      <input className="form-control mt-2"
        placeholder="Item"
        onChange={e => setItemName(e.target.value)} />

      <input className="form-control mt-2"
        placeholder="Quantity"
        onChange={e => setQuantity(e.target.value)} />

      <input type="file" className="form-control mt-2"
        onChange={e => setFile(e.target.files[0])} />

      <button className="btn btn-success mt-3" onClick={submit}>
        Upload
      </button>

    </div>
  );
}