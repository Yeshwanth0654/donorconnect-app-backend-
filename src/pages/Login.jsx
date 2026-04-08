import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.role);
export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      if (!res.data.token) {
        alert("Invalid credentials ❌");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login Success ✅");

      // 🔥 ROLE BASED REDIRECT
      if (res.data.role === "ADMIN") navigate("/admin");
      else if (res.data.role === "RECIPIENT") navigate("/request");
      else navigate("/dashboard");

    } catch {
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: "400px" }}>
        <h3 className="text-center">DonorConnect Login</h3>

        <input className="form-control mt-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input className="form-control mt-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="btn btn-primary mt-4"
          onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}