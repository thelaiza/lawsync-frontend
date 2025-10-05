import { useState } from "react";
import { Link } from "react-router-dom";

export default function LawSyncCadastro({ onSubmit, apiError }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    country: "Brasil",
    oab: "",
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const errors = {
    nome: !form.nome ? "Informe seu nome" : null,
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? "Email inválido" : null,
    senha: form.senha.length < 6 ? "Mínimo de 6 caracteres" : null,
    country: !form.country ? "Informe o país" : null,
    oab: !form.oab ? "Informe o número da OAB" : null,
  };

  const hasError = Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      nome: true,
      email: true,
      senha: true,
      country: true,
      oab: true,
    });
    if (hasError) return;
    try {
      setLoading(true);
      await onSubmit?.({
        name: form.nome,
        email: form.email,
        password: form.senha,
        country: form.country,
        oab: form.oab,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-form" aria-labelledby="cadastro-title">
      <h2 id="cadastro-title" className="auth-title">
        Criar Conta
      </h2>
      <p className="auth-description">
        Preencha os dados abaixo para criar sua conta
      </p>

      <form className="auth-form-fields" onSubmit={handleSubmit} noValidate>
        {/* Nome */}
        <label
          className={`field ${touched.nome && errors.nome ? "has-error" : ""}`}
        >
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

        {/* Email */}
        <label
          className={`field ${
            (touched.email && errors.email) || apiError?.field === "email"
              ? "has-error"
              : ""
          }`}
        >
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
          {apiError?.field === "email" && (
            <small className="error">{apiError.text}</small>
          )}
        </label>

        {/* Senha */}
        <label
          className={`field ${
            touched.senha && errors.senha ? "has-error" : ""
          }`}
        >
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

        {/* País */}
        <label
          className={`field ${
            touched.country && errors.country ? "has-error" : ""
          }`}
        >
          <span className="label">País</span>
          <select
            value={form.country}
            onChange={set("country")}
            onBlur={() => setTouched((t) => ({ ...t, country: true }))}
            aria-invalid={!!(touched.country && errors.country)}
          >
            <option value="Brasil">Brasil</option>
            <option value="Argentina">Argentina</option>
            <option value="Uruguai">Uruguai</option>
            <option value="Paraguai">Paraguai</option>
            <option value="Chile">Chile</option>
            <option value="Colômbia">Colômbia</option>
            <option value="Peru">Peru</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Bolívia">Bolívia</option>
            <option value="Equador">Equador</option>
            <option value="Outro">Outro</option>
          </select>
          {touched.country && errors.country && (
            <small className="error">{errors.country}</small>
          )}
        </label>

        {/* OAB */}
        <label
          className={`field ${touched.oab && errors.oab ? "has-error" : ""}`}
        >
          <span className="label">Número da OAB</span>
          <input
            type="text"
            placeholder="123456"
            value={form.oab}
            onChange={set("oab")}
            onBlur={() => setTouched((t) => ({ ...t, oab: true }))}
            aria-invalid={!!(touched.oab && errors.oab)}
          />
          {touched.oab && errors.oab && (
            <small className="error">{errors.oab}</small>
          )}
        </label>

        <button
          className="auth-btn auth-btn-primary"
          type="submit"
          disabled={loading || hasError}
        >
          {loading ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-link">
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </section>
  );
}
