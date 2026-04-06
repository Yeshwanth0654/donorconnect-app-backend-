import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getApiErrorMessage } from "../api";

export default function AuthPageFixed() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "DONOR",
  });
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.email.trim() || !form.password.trim()) {
      alert("Email and password are required.");
      return;
    }

    if (!isLogin && !form.name.trim()) {
      alert("Full name is required.");
      return;
    }

    if (inputCaptcha.trim() !== captcha) {
      alert("Captcha is incorrect.");
      generateCaptcha();
      setInputCaptcha("");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = isLogin
        ? { email: form.email.trim(), password: form.password }
        : {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
          };

      const url = isLogin ? "/auth/login" : "/auth/register";
      const res = await API.post(url, payload);

      if (isLogin) {
        if (!res.data?.token || !res.data?.role) {
          throw new Error("Login response is missing token or role.");
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userEmail", res.data.email || form.email.trim());
        localStorage.setItem("userName", res.data.name || form.name.trim() || "");

        if (res.data.role === "ADMIN") navigate("/admin");
        else if (res.data.role === "DONOR") navigate("/donor");
        else if (res.data.role === "RECIPIENT") navigate("/recipient");
        else if (res.data.role === "LOGISTICS") navigate("/logistics");
        else alert(`Logged in, but received an unknown role: ${res.data.role}`);
      } else {
        alert("Account created successfully.");
        setIsLogin(true);
        setForm({
          name: "",
          email: form.email.trim(),
          password: "",
          role: "DONOR",
        });
      }
    } catch (error) {
      alert(getApiErrorMessage(error, "Authentication failed."));
    } finally {
      setIsSubmitting(false);
      generateCaptcha();
      setInputCaptcha("");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>{isLogin ? "Welcome" : "Create Account"}</h2>
        <p style={{ color: "#64748b" }}>
          {isLogin ? "Login to continue" : "Register to access platform"}
        </p>

        {!isLogin && (
          <>
            <input
              placeholder="Full Name"
              style={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              style={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="DONOR">Donor</option>
              <option value="RECIPIENT">Recipient</option>
              <option value="LOGISTICS">Logistics</option>
              <option value="ADMIN">Admin</option>
            </select>
          </>
        )}

        <input
          placeholder="Email"
          style={styles.input}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div style={styles.captchaBox} onClick={generateCaptcha}>
          {captcha}
        </div>

        <input
          placeholder="Enter Captcha"
          style={styles.input}
          value={inputCaptcha}
          onChange={(e) => setInputCaptcha(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.75 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p style={{ marginTop: "10px" }}>
          {isLogin ? "Don't have account?" : "Already have account?"}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #f8fafc, #e2e8f0)",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "350px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "bold",
  },
  captchaBox: {
    background: "#1e293b",
    color: "white",
    padding: "10px",
    textAlign: "center",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  link: {
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
