import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LawSyncLogin from "../components/LawSyncLogin.jsx";
import "../styles/login.css";

export default function LoginPage() {
  const [message, setMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (payload) => {
    setMessage(null);
    setApiError(null);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError({
          field: data.field || "email",
          text: data.message || "Email ou senha inválidos.",
        });
        throw new Error(data.message || "Falha ao autenticar.");
      }

      const { token, user } = data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      navigate(from, { replace: true });

    } catch (err) {
      if (!apiError) {
        setMessage({ type: "error", text: err.message });
      }
    }
  };

  return (
    <div className="login-layout">
      <aside className="brand-side">
        <div className="brand-box">
          <span className="brand-line">Law</span>
          <span className="brand-line">Sync</span>
        </div>
      </aside>

      <main className="form-side">
        {message && (
          <div
            className={`alert ${message.type}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
              padding: "12px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              border: `1px solid ${message.type === "error" ? "#fca5a5" : "#6ee7b7"}`,
              color: message.type === "error" ? "#b91c1c" : "#065f46",
            }}
          >
            {message.text}
          </div>
        )}

        <LawSyncLogin onSubmit={handleSubmit} apiError={apiError} />
      </main>
    </div>
  );
}