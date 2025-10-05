import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentsService } from "../services/api";
import Layout from "../components/Layout";
import LawSyncAppointmentModal from "../components/LawSyncAppointmentModal";
import Loading from "../components/Loading";
import "../styles/calendar.css";

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // "month", "week", "day"
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar compromissos da API
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await appointmentsService.getAll();
        setAppointments(data);
      } catch (err) {
        console.error("Erro ao carregar compromissos:", err);
        setError("Erro ao carregar compromissos. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction * 7);
      return newDate;
    });
  };

  const navigateDay = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const today = new Date();
      days.push({
        date: dateObj,
        isCurrentMonth: true,
        isToday: dateObj.toDateString() === today.toDateString(),
      });
    }

    // Dias do próximo mês para completar a grade
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const dateObj = new Date(year, month + 1, day);
      days.push({
        date: dateObj,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.inicio);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const now = new Date();
    const selectedDate = new Date(date);

    // Se a data selecionada é hoje, usa o horário atual
    // Se não, usa 9:00 como padrão
    const isToday = selectedDate.toDateString() === now.toDateString();
    const startHour = isToday ? now.getHours() : 9;
    const startMinute = isToday ? now.getMinutes() : 0;

    setSelectedAppointment({
      id: crypto.randomUUID?.() || String(Date.now()),
      titulo: "Novo compromisso",
      inicio: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        startHour,
        startMinute
      ).toISOString(),
      fim: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        startHour + 1,
        startMinute
      ).toISOString(),
      descricao: "",
    });
    setOpenModal(true);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleNewCommitment = () => {
    const now = new Date();
    setSelectedAppointment({
      id: crypto.randomUUID?.() || String(Date.now()),
      titulo: "Novo compromisso",
      inicio: now.toISOString(),
      fim: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      descricao: "",
    });
    setOpenModal(true);
  };

  const handleSave = async (payload) => {
    try {
      if (payload.id && appointments.find((a) => a.id === payload.id)) {
        // Atualizar existente
        await appointmentsService.update(payload.id, payload);
        setAppointments((prev) =>
          prev.map((a) => (a.id === payload.id ? payload : a))
        );
      } else {
        // Criar novo
        const newAppointment = await appointmentsService.create(payload);
        setAppointments((prev) => [...prev, newAppointment]);
      }
      setOpenModal(false);
    } catch (err) {
      console.error("Erro ao salvar compromisso:", err);
      alert("Erro ao salvar compromisso. Tente novamente.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await appointmentsService.delete(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setOpenModal(false);
    } catch (err) {
      console.error("Erro ao excluir compromisso:", err);
      alert("Erro ao excluir compromisso. Tente novamente.");
    }
  };

  const calendarDays = useMemo(
    () => getDaysInMonth(currentDate),
    [currentDate]
  );

  const renderMonthView = () => (
    <div className="calendar-month">
      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day.date);
          return (
            <div
              key={index}
              className={`calendar-day ${
                !day.isCurrentMonth ? "other-month" : ""
              } ${day.isToday ? "today" : ""}`}
              onClick={() => handleDateClick(day.date)}
            >
              <div className="calendar-day-number">{day.date.getDate()}</div>
              <div className="calendar-day-appointments">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`calendar-appointment appointment-${appointment.tipo}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAppointmentClick(appointment);
                    }}
                  >
                    <div className="appointment-time">
                      {new Date(appointment.inicio).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                    <div className="appointment-title">
                      {appointment.titulo}
                    </div>
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="calendar-more-appointments">
                    +{dayAppointments.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }

    return (
      <div className="calendar-week">
        <div className="calendar-week-header">
          {weekDates.map((date, index) => (
            <div key={index} className="calendar-week-day-header">
              <div className="week-day-name">{weekDays[index]}</div>
              <div className="week-day-number">{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="calendar-week-body">
          {weekDates.map((date, index) => {
            const dayAppointments = getAppointmentsForDate(date);
            return (
              <div key={index} className="calendar-week-day">
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`calendar-appointment appointment-${appointment.tipo}`}
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div className="appointment-time">
                      {new Date(appointment.inicio).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                    <div className="appointment-title">
                      {appointment.titulo}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);

    return (
      <div className="calendar-day-view">
        <div className="calendar-day-header">
          <h3>
            {currentDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>
        <div className="calendar-day-appointments-list">
          {dayAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>Nenhum compromisso agendado para hoje</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/agenda")}
              >
                Ver Calendário
              </button>
            </div>
          ) : (
            dayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`calendar-appointment-card appointment-${appointment.tipo}`}
                onClick={() => handleAppointmentClick(appointment)}
              >
                <div className="appointment-time">
                  {new Date(appointment.inicio).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(appointment.fim).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="appointment-title">{appointment.titulo}</div>
                {appointment.descricao && (
                  <div className="appointment-description">
                    {appointment.descricao}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout title="Calendário">
        <Loading message="Carregando calendário..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Calendário">
        <div className="error-state">
          <h3>Erro ao carregar calendário</h3>
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
    <Layout title="Calendário" onNewCommitment={handleNewCommitment}>
      <div className="calendar-container">
        {/* Header do Calendário */}
        <div className="calendar-header">
          <div className="calendar-navigation">
            <button
              className="btn btn-icon"
              onClick={() => {
                if (viewMode === "month") navigateMonth(-1);
                else if (viewMode === "week") navigateWeek(-1);
                else navigateDay(-1);
              }}
            >
              ←
            </button>
            <h2 className="calendar-title">
              {viewMode === "month" &&
                `${
                  monthNames[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`}
              {viewMode === "week" &&
                `Semana de ${currentDate.toLocaleDateString("pt-BR")}`}
              {viewMode === "day" &&
                currentDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </h2>
            <button
              className="btn btn-icon"
              onClick={() => {
                if (viewMode === "month") navigateMonth(1);
                else if (viewMode === "week") navigateWeek(1);
                else navigateDay(1);
              }}
            >
              →
            </button>
          </div>

          <div className="calendar-controls">
            <div className="view-mode-selector">
              <button
                className={`btn ${
                  viewMode === "month" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setViewMode("month")}
              >
                Mês
              </button>
              <button
                className={`btn ${
                  viewMode === "week" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setViewMode("week")}
              >
                Semana
              </button>
              <button
                className={`btn ${
                  viewMode === "day" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setViewMode("day")}
              >
                Dia
              </button>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </button>
          </div>
        </div>

        {/* Conteúdo do Calendário */}
        <div className="calendar-content">
          {viewMode === "month" && renderMonthView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "day" && renderDayView()}
        </div>
      </div>

      {/* Modal de Compromissos */}
      <LawSyncAppointmentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        compromisso={selectedAppointment}
        onSave={handleSave}
        onDelete={handleDelete}
        mode={
          selectedAppointment?.id &&
          appointments.find((a) => a.id === selectedAppointment.id)
            ? "view"
            : "create"
        }
      />
    </Layout>
  );
}
