import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/sidebar.css";

export default function Sidebar({ onNewCommitment }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="ls-sidebar">
      <div className="ls-logo">
        <div className="ls-logo-text">LawSync</div>
      </div>

      <nav className="ls-nav">
        <div className="ls-nav-section">
          <div className="ls-nav-title">Principal</div>

          <NavLink to="/dashboard" className="ls-nav-link">
            Dashboard
          </NavLink>

          <NavLink to="/agenda" className="ls-nav-link">
            Calendário
          </NavLink>
        </div>

        <div className="ls-nav-section">
          <div className="ls-nav-title">Compromissos</div>

          <button
            type="button"
            className="ls-nav-link ls-nav-button"
            onClick={onNewCommitment}
          >
            Novo Compromisso
          </button>
        </div>

        <div className="ls-nav-section">
          <div className="ls-nav-title">Conta</div>

          <NavLink to="/perfil" className="ls-nav-link">
            Meu Perfil
          </NavLink>

          <button
            type="button"
            className="ls-nav-link ls-nav-button ls-nav-logout"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </nav>

      <div className="ls-sidebar-footer">
        <div className="ls-user-info">
          <div className="ls-user-avatar">{user?.name?.charAt(0) || "U"}</div>
          <div className="ls-user-details">
            <div className="ls-user-name">
              {user?.name?.split(" ")[0] || "Usuário"}
            </div>
            <div className="ls-user-role">Advogado</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
