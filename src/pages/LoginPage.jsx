import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LawSyncLogin from "../components/LawSyncLogin.jsx";
import "../styles/login.css";

export default function LoginPage() {
  const [message, setMessage] = useState(null); // banner opcional (sucesso/erro geral)
  const [apiError, setApiError] = useState(null); // erro de campo vindo do back (ex.: email/senha)
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setMessage(null);
    setApiError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // { email, password }
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          // mostra “Credenciais inválidas” abaixo do campo (ajuste field se preferir em "password")
          setApiError({
            field: "email",
            text: data.message || "Email ou senha inválidos.",
          });
        }
        throw new Error(data.message || "Falha ao autenticar");
      }

      // sucesso
      localStorage.setItem("token", data.token);
      setMessage({ type: "success", text: "Login realizado com sucesso!" });

      // redireciona (ajuste para a rota pós-login do seu app)
      setTimeout(() => {
        navigate("/dashboard"); // ou "/agenda", "/home"… você que manda
      }, 800);
    } catch (err) {
      // se não houve apiError específico, exibe um banner geral
      if (!apiError) setMessage({ type: "error", text: err.message });
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
              border: `1px solid ${
                message.type === "error" ? "#fca5a5" : "#6ee7b7"
              }`,
              color: message.type === "error" ? "#b91c1c" : "#065f46",
              background: message.type === "error" ? "#fee2e2" : "#d1fae5",
            }}
          >
            <span>{message.type === "error" ? "⚠️" : "✅"}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* passe o erro do back para o componente do formulário */}
        <LawSyncLogin onSubmit={handleSubmit} apiError={apiError} />
      </main>
    </div>
  );
}
