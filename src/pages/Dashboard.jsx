import Layout from "../components/Layout";
import "../styles/dashboard.css";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("authUser") || "{}");
  const firstName = user?.name?.split(" ")[0] || "Usuário";

  return (
    <Layout title="Dashboard">
      <div className="ls-dashboard">
        <div className="ls-card">
          <h2>Bem-vinda, {firstName} 👋</h2>
          <p>
            Aqui você acompanha seus compromissos, acessa o perfil e cria novos
            agendamentos.
          </p>
        </div>

        <div className="ls-grid">
          <div className="ls-tile">
            <div className="ls-tile-title">Próximos eventos</div>
            <div className="ls-tile-empty">Nenhum evento para hoje.</div>
          </div>
          <div className="ls-tile">
            <div className="ls-tile-title">Atalhos</div>
            <ul className="ls-list">
              <li><a href="/agenda">Abrir calendário</a></li>
              <li><a href="/compromissos/novo">Criar compromisso</a></li>
              <li><a href="/perfil">Ver perfil</a></li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
