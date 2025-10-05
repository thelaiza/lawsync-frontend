import { useState } from "react";
import { Link } from "react-router-dom"; 

export default function LawSyncLogin({ onSubmit }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const errors = {
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? "Email inválido" : null,
    senha: !form.senha ? "Informe sua senha" : null,
  };

  const hasError = Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, senha: true });
    if (hasError) return;
    try {
      setLoading(true);
      await onSubmit?.({
        email: form.email,
        password: form.senha,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-form" aria-labelledby="login-title">
      <h2 id="login-title" className="auth-title">
        Faça Login
      </h2>
      <p className="auth-description">
        Entre com suas credenciais para acessar sua agenda
      </p>

      <form className="auth-form-fields" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span className="label">Email</span>
          <input
            type="email"
            placeholder="xxxxxx@gmail.com"
            value={form.email}
            onChange={set("email")}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={!!(touched.email && errors.email)}
          />
          {touched.email && errors.email && (
            <small className="error">{errors.email}</small>
          )}
        </label>

        <label className="field">
          <span className="label">Senha</span>
          <input
            type="password"
            placeholder="************"
            value={form.senha}
            onChange={set("senha")}
            onBlur={() => setTouched((t) => ({ ...t, senha: true }))}
            aria-invalid={!!(touched.senha && errors.senha)}
          />
          {touched.senha && errors.senha && (
            <small className="error">{errors.senha}</small>
          )}
        </label>

        <button
          className="auth-btn auth-btn-primary"
          type="submit"
          disabled={loading || hasError}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      
      <div className="auth-footer">
        <p className="auth-link">
          Não tem uma conta?{" "}
          <Link to="/cadastro">Cadastre-se aqui</Link>
        </p>
      </div>
    </section>
  );
}