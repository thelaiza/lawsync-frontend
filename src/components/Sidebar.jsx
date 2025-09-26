import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="ls-sidebar">
      <div className="ls-logo">LawSync</div>

      <nav className="ls-nav">
        <div className="ls-nav-title">Menu</div>
        <NavLink to="/agenda" className="ls-nav-link">Calendário</NavLink>
        <NavLink to="/compromissos/novo" className="ls-nav-link">Criar Compromisso</NavLink>
        <NavLink to="/perfil" className="ls-nav-link">Visualizar Conta</NavLink>
      </nav>
    </aside>
  );
}
