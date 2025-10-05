import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/api";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import "../styles/profile.css";

export default function Profile() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    oab: "",
  });

  // Atualiza formData quando user for carregado
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        country: user.country || "",
        oab: user.oab || "",
      });
    }
  }, [user]);

  // Mostra loading enquanto os dados do usuário estão sendo carregados
  if (authLoading) {
    return (
      <Layout title="Meu Perfil">
        <Loading message="Carregando perfil..." />
      </Layout>
    );
  }

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await userService.updateProfile(formData);
      updateUser(response.user);
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      country: user?.country || "",
      oab: user?.oab || "",
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      
      // Validações
      if (!passwordData.currentPassword) {
        alert("Digite sua senha atual");
        return;
      }
      
      if (!passwordData.newPassword) {
        alert("Digite a nova senha");
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres");
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("As senhas não coincidem");
        return;
      }

      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Limpa o modal
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordModal(false);
      
      alert("Senha alterada com sucesso!");
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      alert("Erro ao alterar senha. Verifique sua senha atual e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="Meu Perfil"
      action={
        <div className="profile-actions">
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
        </div>
      }
    >
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user?.name?.charAt(0) || "M"}
            </div>
          </div>
          <div className="profile-info">
            <h2>{formData.name}</h2>
            <p className="profile-role">Advogado</p>
            <p className="profile-oab">OAB: {formData.oab}</p>
          </div>
        </div>

        <div className="profile-form">
          <div className="form-section">
            <h3>Informações Pessoais</h3>
            <div className="form-grid">
              <Field
                label="Nome Completo"
                value={formData.name}
                isEditing={isEditing}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, name: value }))
                }
              />
               <Field
                 label="Email"
                 value={formData.email}
                 isEditing={false}
                 onChange={(value) =>
                   setFormData((prev) => ({ ...prev, email: value }))
                 }
               />
              <Field
                label="País"
                value={formData.country}
                isEditing={isEditing}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, country: value }))
                }
                type="select"
              />
              <Field
                label="Registro OAB"
                value={formData.oab}
                isEditing={isEditing}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, oab: value }))
                }
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Segurança</h3>
            <div className="security-section">
              <div className="security-item">
                <div className="security-info">
                  <h4>Senha</h4>
                  <p>Última alteração: há 30 dias</p>
                </div>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      {showPasswordModal && (
        <div className="password-modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <h3>Alterar Senha</h3>
              <button 
                className="password-modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="password-modal-body">
              <div className="password-field">
                <label>Senha Atual</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Digite sua senha atual"
                />
              </div>
              
              <div className="password-field">
                <label>Nova Senha</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Digite a nova senha"
                />
              </div>
              
              <div className="password-field">
                <label>Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>
            
            <div className="password-modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleChangePassword}
                disabled={isLoading}
              >
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Field({ label, value, isEditing = false, onChange, type = "text" }) {
  return (
    <div className="profile-field">
      <label className="field-label">{label}</label>
      {isEditing ? (
        type === "select" ? (
          <select
            className="field-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
        ) : (
          <input
            type={type}
            className="field-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      ) : (
        <div className="field-value">{value || "—"}</div>
      )}
    </div>
  );
}
