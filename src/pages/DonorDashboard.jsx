import Navbar from "../components/Navbar";

export default function DonorDashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2>Welcome Donor 👋</h2>
        <p style={{ color: "gray" }}>
          Manage your donations and contribute to active drives.
        </p>

        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card p-4 text-center">
              <h6>Total Donations</h6>
              <h2>10</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 text-center">
              <h6>Pending Donations</h6>
              <h2>3</h2>
            </div>
          </div>

        </div>

        <div className="mt-5">

          <button
            className="btn btn-primary me-2"
            onClick={() => window.location.href="/add"}
          >
            ➕ Add Donation
          </button>

          <button
            className="btn btn-outline-dark"
            onClick={() => window.location.href="/drives"}
          >
            📢 View Drives
          </button>

        </div>

      </div>
    </>
  );
}