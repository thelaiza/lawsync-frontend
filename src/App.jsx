import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroPage from "./pages/CadastroPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rota para a página de login (página inicial) */}
        <Route path="/" element={<LoginPage />} />

        {/* rota para a página de cadastro */}
        <Route path="/cadastro" element={<CadastroPage />} />
      </Routes>
    </BrowserRouter>
  );
}