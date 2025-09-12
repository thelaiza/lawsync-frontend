import { useState } from "react";

export default function LawSyncCadastro({ onSubmit }) {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const errors = {
    nome: !form.nome ? "Informe seu nome" : null,
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? "Email inválido" : null,
    senha: form.senha.length < 6 ? "Mínimo de 6 caracteres" : null,
  };

  const hasError = Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ nome: true, email: true, senha: true });
    if (hasError) return;
    try {
      setLoading(true);
      await onSubmit?.({
        name: form.nome,
        email: form.email,
        password: form.senha,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cadastro-card" aria-labelledby="cadastro-title">
      <h1 id="cadastro-title" className="cadastro-title">
        Cadastre-se
      </h1>

      <form className="cadastro-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span className="label">Nome</span>
          <input
            type="text"
            placeholder="Maria"
            value={form.nome}
            onChange={set("nome")}
            onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
            aria-invalid={!!(touched.nome && errors.nome)}
          />
          {touched.nome && errors.nome && (
            <small className="error">{errors.nome}</small>
          )}
        </label>

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
          className="primary-btn"
          type="submit"
          disabled={loading || hasError}
        >
          {loading ? "Enviando..." : "Cadastro"}
        </button>
      </form>
    </section>
  );
}
