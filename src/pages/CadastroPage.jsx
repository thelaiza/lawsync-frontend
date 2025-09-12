import LawSyncCadastro from "../components/LawSyncCadastro.jsx";
import "../styles/cadastro.css";

export default function CadastroPage() {
  const handleSubmit = async (payload) => {
    // aqui você integra com seu backend (fetch/axios)
    // por enquanto só loga:
    console.log("Cadastro submit:", payload);
    alert("Cadastro enviado! (console.log para ver os dados)");
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
        <LawSyncCadastro onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
