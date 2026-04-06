import Navbar from "../components/Navbar";

export default function RecipientDashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2>Welcome Recipient 👋</h2>
        <p style={{ color: "gray" }}>
          Request essential items and track your requests.
        </p>

        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card p-4 text-center">
              <h6>Total Requests</h6>
              <h2>5</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 text-center">
              <h6>Delivered</h6>
              <h2>2</h2>
            </div>
          </div>

        </div>

        <div className="mt-5">

          <button
            className="btn btn-primary"
            onClick={() => window.location.href="/request"}
          >
            📦 Request Items
          </button>

        </div>

      </div>
    </>
  );
}