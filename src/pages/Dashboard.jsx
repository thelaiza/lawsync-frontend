import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { appointmentsService, formatDateTime } from "../services/api";
import Layout from "../components/Layout";
import LawSyncAppointmentModal from "../components/LawSyncAppointmentModal";
import Loading from "../components/Loading";
import "../styles/dashboard.css";
import "../styles/modal.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Usuário";

  const [openModal, setOpenModal] = useState(false);
  const [current, setCurrent] = useState({
    id: crypto.randomUUID?.() || String(Date.now()),
    titulo: "Novo compromisso",
    inicio: new Date().toISOString(),
    fim: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    descricao: "",
  });

  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    thisWeekAppointments: 0,
    upcomingAppointments: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar compromissos da API
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const appointments = await appointmentsService.getAll();
        
        setRecentAppointments(appointments);

        // Calcular estatísticas
        const today = new Date();
        const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        setStats({
          totalAppointments: appointments.length,
          todayAppointments: appointments.filter((apt) => {
            const aptDate = new Date(apt.inicio);
            return aptDate.toDateString() === today.toDateString();
          }).length,
          thisWeekAppointments: appointments.filter((apt) => {
            const aptDate = new Date(apt.inicio);
            return aptDate >= today && aptDate <= thisWeek;
          }).length,
          upcomingAppointments: appointments.filter((apt) => {
            const aptDate = new Date(apt.inicio);
            return aptDate > today;
          }).length,
        });
      } catch (err) {
        console.error('Erro ao carregar compromissos:', err);
        setError('Erro ao carregar compromissos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleNewCommitment = () => {
    setCurrent({
      id: crypto.randomUUID?.() || String(Date.now()),
      titulo: "Novo compromisso",
      inicio: new Date().toISOString(),
      fim: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      descricao: "",
    });
    setOpenModal(true);
  };

  const handleSave = async (payload) => {
    try {
      if (payload.id && recentAppointments.find(a => a.id === payload.id)) {
        // Atualizar existente
        await appointmentsService.update(payload.id, payload);
        setRecentAppointments(prev => prev.map(a => a.id === payload.id ? payload : a));
      } else {
        // Criar novo
        const newAppointment = await appointmentsService.create(payload);
        setRecentAppointments(prev => [...prev, newAppointment]);
      }
      setOpenModal(false);
    } catch (err) {
      console.error('Erro ao salvar compromisso:', err);
      alert('Erro ao salvar compromisso. Tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await appointmentsService.delete(id);
      setRecentAppointments(prev => prev.filter(a => a.id !== id));
      setOpenModal(false);
    } catch (err) {
      console.error('Erro ao excluir compromisso:', err);
      alert('Erro ao excluir compromisso. Tente novamente.');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getAppointmentTypeIcon = (tipo) => {
    switch (tipo) {
      case "reuniao":
        return "🤝";
      case "audiencia":
        return "⚖️";
      case "consulta":
        return "💼";
      default:
        return "📅";
    }
  };

  const getAppointmentTypeColor = (tipo) => {
    switch (tipo) {
      case "reuniao":
        return "#4caf50";
      case "audiencia":
        return "#ff9800";
      case "consulta":
        return "#9c27b0";
      default:
        return "#2196f3";
    }
  };

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <Loading message="Carregando compromissos..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="error-state">
          <h3>Erro ao carregar dados</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" onNewCommitment={handleNewCommitment}>
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div className="welcome-content">
            <h2>
              {getGreeting()}, {firstName}
            </h2>
            <p>Gerencie seus compromissos e mantenha sua agenda organizada.</p>
          </div>
          <div className="welcome-actions">
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate("/agenda")}
            >
              Ver Calendário
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-number">{stats.totalAppointments}</div>
              <div className="stat-label">Total de Compromissos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-number">{stats.todayAppointments}</div>
              <div className="stat-label">Hoje</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-number">{stats.thisWeekAppointments}</div>
              <div className="stat-label">Esta Semana</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-number">{stats.upcomingAppointments}</div>
              <div className="stat-label">Próximos</div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Compromissos Recentes</h3>
            <button
              className="btn btn-link"
              onClick={() => navigate("/agenda")}
            >
              Ver todos →
            </button>
          </div>

          <div className="appointments-list">
            {recentAppointments.length === 0 ? (
              <div className="empty-state">
                <h4>Nenhum compromisso encontrado</h4>
                <p>Acesse o calendário para visualizar seus compromissos.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/agenda")}
                >
                  Ver Calendário
                </button>
              </div>
            ) : (
              recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="appointment-card"
                  onClick={() => {
                    setCurrent(appointment);
                    setOpenModal(true);
                  }}
                >
                  <div
                    className="appointment-type-indicator"
                    style={{
                      backgroundColor: getAppointmentTypeColor(
                        appointment.tipo
                      ),
                    }}
                  ></div>

                  <div className="appointment-details">
                    <div className="appointment-title">
                      {appointment.titulo}
                    </div>
                    <div className="appointment-time">
                      {formatDateTime(appointment.inicio)}
                    </div>
                    {appointment.descricao && (
                      <div className="appointment-description">
                        {appointment.descricao}
                      </div>
                    )}
                  </div>

                  <div className="appointment-actions">
                    <button className="btn btn-icon-small">Editar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Ações Rápidas</h3>
          </div>

          <div className="quick-actions">
            <button
              className="quick-action-card"
              onClick={() => navigate("/agenda")}
            >
              <div className="quick-action-title">Ver Calendário</div>
              <div className="quick-action-description">
                Visualize sua agenda completa
              </div>
            </button>

            <button
              className="quick-action-card"
              onClick={() => navigate("/perfil")}
            >
              <div className="quick-action-title">Meu Perfil</div>
              <div className="quick-action-description">
                Gerencie suas informações pessoais
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Compromissos */}
      <LawSyncAppointmentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        compromisso={current}
        onSave={handleSave}
        onDelete={handleDelete}
        mode={
          current?.id && recentAppointments.find((a) => a.id === current.id)
            ? "view"
            : "create"
        }
      />
    </Layout>
  );
}
