import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPageFixed";
import AdminPanel from "./pages/AdminPanelPro";
import AdminDonations from "./pages/AdminDonationsPro";
import AdminRequests from "./pages/AdminRequestsPro";
import AdminDrives from "./pages/AdminDrivesPro";
import AdminUsers from "./pages/AdminUsersPro";

import DonorDashboard from "./pages/DonorDashboardPro";
import RecipientDashboard from "./pages/RecipientDashboardPro";
import LogisticsDashboard from "./pages/LogisticsDashboardPro";

import AddDonation from "./pages/AddDonationPro";
import RequestPage from "./pages/RequestPagePro";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AuthPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/drives" element={<AdminDrives />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        {/* ROLE BASED */}
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/recipient" element={<RecipientDashboard />} />
        <Route path="/logistics" element={<LogisticsDashboard />} />

        {/* FEATURES */}
        <Route path="/add" element={<AddDonation />} />
        <Route path="/request" element={<RequestPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
