import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LawSyncLogin from "../components/LawSyncLogin.jsx";
import "../styles/auth.css";

export default function LoginPage() {
  const [message, setMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (payload) => {
    setMessage(null);
    setApiError(null);

    try {
      await login(payload.email, payload.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Erro no login:', err);
      setMessage({ 
        type: "error", 
        text: err.message || "Erro ao fazer login. Tente novamente." 
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
            <div className={`auth-alert ${message.type}`}>
              {message.text}
            </div>
          )}

          <LawSyncLogin onSubmit={handleSubmit} apiError={apiError} />
        </div>
      </div>
    </div>
  );
}
