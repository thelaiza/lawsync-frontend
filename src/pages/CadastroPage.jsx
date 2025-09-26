import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LawSyncCadastro from "../components/LawSyncCadastro.jsx";
import "../styles/cadastro.css";

export default function CadastroPage() {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro no cadastro");
      }

      // sucesso → redireciona
      setMessage({ type: "success", text: "Cadastro realizado com sucesso!" });
      console.log("Usuário cadastrado:", data.user);

      setTimeout(() => {
        navigate("/");
      }, 1200); // dá 1,2s para o usuário ver a mensagem antes de trocar
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="cadastro-layout">
      <aside className="brand-side">
        <div className="brand-box">
          <span className="brand-line">Law</span>
          <span className="brand-line">Sync</span>
        </div>
      </aside>

      <main className="form-side">
        {message && (
          <div
            className={`alert ${
              message.type === "error" ? "alert-error" : "alert-success"
            }`}
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "8px",
              color: message.type === "error" ? "#b91c1c" : "#065f46",
              background: message.type === "error" ? "#fee2e2" : "#d1fae5",
            }}
          >
            {message.text}
          </div>
        )}

        <LawSyncCadastro onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
