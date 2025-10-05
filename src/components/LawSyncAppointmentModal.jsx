import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TIPOS_COMPROMISSO } from "../services/api";

export default function LawSyncAppointmentModal({
  isOpen,
  onClose,
  compromisso, // { id, titulo, inicio: ISO, fim: ISO, descricao }
  onDelete, // (id) => void | Promise<void>
  onSave, // (payload) => void | Promise<void>
  mode = "view", // "create" | "view"
}) {
  // no "create" começa já em modo edição
  const [editMode, setEditMode] = useState(mode === "create");
  const [form, setForm] = useState(() => ({
    titulo: compromisso?.titulo || "",
    inicio: compromisso?.inicio || new Date().toISOString(),
    fim:
      compromisso?.fim || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    descricao: compromisso?.descricao || "",
    tipo: compromisso?.tipo || "reuniao",
  }));

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setEditMode(mode === "create" ? true : false);
    setForm({
      titulo: compromisso?.titulo || "",
      inicio: compromisso?.inicio || new Date().toISOString(),
      fim:
        compromisso?.fim || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      descricao: compromisso?.descricao || "",
      tipo: compromisso?.tipo || "reuniao",
    });
    // foco no primeiro campo quando abrir
    setTimeout(() => firstInputRef.current?.focus(), 0);
  }, [isOpen, compromisso, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const formatoPT = useMemo(
    () => ({ dateStyle: "short", timeStyle: "short" }),
    []
  );
  const dataRange =
    compromisso &&
    `${new Date(compromisso.inicio).toLocaleString(
      "pt-BR",
      formatoPT
    )} — ${new Date(compromisso.fim || compromisso.inicio).toLocaleString(
      "pt-BR",
      formatoPT
    )}`;

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.titulo.trim()) return;
    await onSave?.({
      id: compromisso?.id,
      titulo: form.titulo.trim(),
      inicio: form.inicio,
      fim: form.fim || form.inicio,
      descricao: form.descricao?.trim() || "",
      tipo: form.tipo,
    });
    if (mode === "create") {
      onClose?.();
    } else {
      setEditMode(false);
    }
  };

  return createPortal(
    <div
      className="ls-modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <section
        className="ls-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ls-modal-title"
      >
        {/* Header */}
        <header className="ls-modal-header ls-modal-header--clean">
          <h2 id="ls-modal-title" className="ls-modal-title">
            {mode === "create"
              ? "Criar Compromisso"
              : compromisso?.titulo || "Compromisso"}
          </h2>
          <button className="ls-icon-btn" aria-label="Fechar" onClick={onClose}>
            ×
          </button>
        </header>

        {/* Body */}
        <div className="ls-modal-body">
          {/* Título (sempre campo no create; texto no view; campo no edit) */}
          <label className="ls-field">
            <span className="ls-label">Título</span>
            {mode === "create" || editMode ? (
              <input
                ref={firstInputRef}
                className="ls-input"
                value={form.titulo}
                onChange={set("titulo")}
                placeholder="Título do compromisso"
              />
            ) : (
              <div className="ls-readonly">{compromisso?.titulo || "—"}</div>
            )}
          </label>

          <label className="ls-field">
            <span className="ls-label">Tipo</span>
            {mode === "view" && !editMode ? (
              <div className="ls-readonly">
                {form.tipo === "reuniao" && "Reunião"}
                {form.tipo === "audiencia" && "Audiência"}
                {form.tipo === "consulta" && "Consulta"}
              </div>
            ) : (
              <select
                className="ls-select"
                value={form.tipo}
                onChange={set("tipo")}
              >
                <option value="reuniao">Reunião</option>
                <option value="audiencia">Audiência</option>
                <option value="consulta">Consulta</option>
              </select>
            )}
          </label>

          <label className="ls-field">
            <span className="ls-label">Data e Horário</span>
            {mode === "view" && !editMode ? (
              <div className="ls-readonly">{dataRange}</div>
            ) : (
              <div className="ls-row-2">
                <input
                  type="datetime-local"
                  className="ls-input"
                  value={toLocalInput(form.inicio)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      inicio: fromLocalInput(e.target.value),
                    }))
                  }
                />
                <input
                  type="datetime-local"
                  className="ls-input"
                  value={toLocalInput(form.fim)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      fim: fromLocalInput(e.target.value),
                    }))
                  }
                />
              </div>
            )}
          </label>

          <label className="ls-field">
            <span className="ls-label">Descrição</span>
            {mode === "view" && !editMode ? (
              <div className="ls-readonly">{compromisso?.descricao || "—"}</div>
            ) : (
              <textarea
                className="ls-textarea"
                rows={6}
                value={form.descricao}
                onChange={set("descricao")}
                placeholder="Detalhes do compromisso"
              />
            )}
          </label>
        </div>

        {/* Footer / Ações */}
        {mode === "create" ? (
          <footer className="ls-modal-actions ls-modal-actions--center">
            <button
              className="ls-btn ls-btn-primary ls-btn-block"
              onClick={handleSave}
            >
              Salvar
            </button>
          </footer>
        ) : (
          <footer className="ls-modal-actions">
            <button
              className="ls-btn ls-btn-danger"
              onClick={() => onDelete?.(compromisso.id)}
            >
              Excluir
            </button>
            {!editMode ? (
              <button
                className="ls-btn ls-btn-secondary"
                onClick={() => setEditMode(true)}
              >
                Editar
              </button>
            ) : (
              <button
                className="ls-btn ls-btn-secondary"
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    titulo: compromisso?.titulo || "",
                    inicio: compromisso?.inicio || "",
                    fim: compromisso?.fim || "",
                    descricao: compromisso?.descricao || "",
                    tipo: compromisso?.tipo || "reuniao",
                  });
                }}
              >
                Cancelar
              </button>
            )}
            <button className="ls-btn ls-btn-primary" onClick={handleSave}>
              Salvar
            </button>
          </footer>
        )}
      </section>
    </div>,
    document.body
  );
}

/* Helpers */
function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  // Usa os métodos locais para manter a hora local
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function fromLocalInput(v) {
  if (!v) return "";
  // Cria a data assumindo que está no fuso horário local
  // e converte para UTC mantendo a hora selecionada
  const d = new Date(v);
  // Converte para UTC mantendo a hora local
  return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
}
