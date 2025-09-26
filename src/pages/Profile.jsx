import Layout from "../components/Layout";
import "../styles/profile.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("authUser") || "{}");

  return (
    <Layout
      title="Perfil"
      action={<button className="ls-icon-btn" title="Editar perfil">✏️</button>}
    >
      <div className="ls-profile">
        <div className="ls-profile-header">
          <div className="ls-avatar" />
          <div className="ls-title">Nome do Usuário</div>
        </div>

        <div className="ls-form">
          <Field label="Nome" value={user?.name || "Maria Alves Oliveira"} />
          <Field label="Email" value={user?.email || "maria@gmail.com"} />
          <Field label="Senha" value="xxxxxxxxxxxxxx" withIcon />
          <Field label="País" value={user?.country || "Brasil"} />
          <Field label="Registro (OAB)" value={user?.oab || "00000098"} />
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, value, withIcon = false }) {
  return (
    <div className="ls-field">
      <label>{label}</label>
      <div className="ls-input-like">
        <span className="ls-muted">{value}</span>
        {withIcon && <span className="ls-edit-mini" title="Alterar senha">✎</span>}
      </div>
    </div>
  );
}
