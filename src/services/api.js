// Configuração da API
// const API_BASE_URL = "http://localhost:4000/api"; local
const API_BASE_URL = "https://lawsync-backend-production.up.railway.app/api";

// Função para fazer requisições autenticadas
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Se body existe e não é string, converte para JSON
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Se é erro de autenticação, limpa o token
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        window.location.href = "/login";
      }
      throw new Error(data.message || "Erro na requisição");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Serviços de Autenticação
export const authService = {
  // Registrar usuário
  register: async (userData) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: userData,
    });

    if (response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", JSON.stringify(response.user));
    }

    return response;
  },

  // Fazer login
  login: async (email, password) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", JSON.stringify(response.user));
    }

    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
  },
};

// Serviços de Compromissos
export const appointmentsService = {
  // Listar compromissos
  getAll: async () => {
    const response = await apiRequest("/appointments");
    return response.data || response;
  },

  // Obter compromisso por ID
  getById: async (id) => {
    const response = await apiRequest(`/appointments/${id}`);
    return response.data || response;
  },

  // Criar compromisso
  create: async (appointmentData) => {
    const response = await apiRequest("/appointments", {
      method: "POST",
      body: appointmentData,
    });
    return response.data || response;
  },

  // Atualizar compromisso
  update: async (id, appointmentData) => {
    const response = await apiRequest(`/appointments/${id}`, {
      method: "PUT",
      body: appointmentData,
    });
    return response.data || response;
  },

  // Deletar compromisso
  delete: async (id) => {
    const response = await apiRequest(`/appointments/${id}`, {
      method: "DELETE",
    });
    return response;
  },
};

// Serviços de Usuário
export const userService = {
  // Atualizar perfil
  updateProfile: async (userData) => {
    const response = await apiRequest("/auth/profile", {
      method: "PUT",
      body: userData,
    });

    if (response.user) {
      localStorage.setItem("authUser", JSON.stringify(response.user));
    }

    return response;
  },

  // Alterar senha
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiRequest("/auth/password", {
      method: "PUT",
      body: { currentPassword, newPassword },
    });
    return response;
  },
};

// Tipos de compromisso disponíveis
export const TIPOS_COMPROMISSO = ["reuniao", "audiencia", "consulta"];

// Função utilitária para formatar datas
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("pt-BR");
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Função para validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar senha
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export default {
  authService,
  appointmentsService,
  userService,
  TIPOS_COMPROMISSO,
  formatDate,
  formatDateTime,
  formatTime,
  validateEmail,
  validatePassword,
};
