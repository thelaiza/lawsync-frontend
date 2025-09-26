import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LawSyncLogin from "../components/LawSyncLogin.jsx";
import "../styles/login.css";

export default function LoginPage() {
  const [message, setMessage] = useState(null);   // banner opcional (sucesso/erro geral)
  const [apiError, setApiError] = useState(null); // erro de campo vindo do back (ex.: email/senha)
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (payload) => {
    setMessage(null);
    setApiError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // { email, password }
      });

      const text = await res.text();           // evita quebrar se vier HTML/empty
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          setApiError({
            field: "email", // troque para "password" se preferir
            text: data?.message || "Email ou senha inválidos.",
          });
        }
        throw new Error(data?.message || `Falha ao autenticar (${res.status})`);
      }

      // sucesso — backend deve devolver { token, user }
      const { token, user } = data || {};
      if (!token) throw new Error("Resposta sem token.");

      // 🔑 CHAVES PADRÃO USADAS PELO GUARD
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user || {}));

      // opcional: limpe o antigo "token" se existir
      localStorage.removeItem("token");

      navigate(from, { replace: true });       // vai pro dashboard (ou origem)
    } catch (err) {
      if (!apiError) setMessage({ type: "error", text: err.message || "Não foi possível fazer login." });
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
              background: message.type === "error" ? "#fee2e2" : "#d1fae5",
            }}
          >
            <span>{message.type === "error" ? "⚠️" : "✅"}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* erro de campo do back vai para o componente do formulário */}
        <LawSyncLogin onSubmit={handleSubmit} apiError={apiError} />
      </main>
    </div>
  );
}
