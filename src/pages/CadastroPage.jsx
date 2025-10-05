import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LawSyncCadastro from "../components/LawSyncCadastro.jsx";
import "../styles/auth.css";

export default function CadastroPage() {
  const [message, setMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      setMessage(null);
      setApiError(null);

      await register(payload);

      setMessage({
        type: "success",
        text: "Cadastro realizado com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setMessage({
        type: "error",
        text: err.message || "Erro interno do servidor. Tente novamente.",
      });
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <h1 className="logo-text">LawSync</h1>
          </div>
          <p className="auth-subtitle">Sistema de Agenda Jurídica</p>
        </div>

        <div className="auth-card">
          {message && (
            <div className={`auth-alert ${message.type}`}>{message.text}</div>
          )}

          <LawSyncCadastro onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
