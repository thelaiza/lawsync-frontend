import LawSyncLogin from "../components/LawSyncLogin.jsx";
import "../styles/login.css";

export default function LoginPage() {
  const handleSubmit = async (payload) => {
    // aqui você integra com seu backend (fetch/axios) para autenticar
    // por enquanto, apenas exibimos os dados no console
    console.log("Login submit:", payload);
    alert("Login enviado! (verifique o console para ver os dados)");
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
        <LawSyncLogin onSubmit={handleSubmit} />
      </main>
    </div>
  );
}