import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const isAuthed = !!localStorage.getItem("authToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />

        {/* privadas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/agenda" element={<Calendar />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to={isAuthed ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
