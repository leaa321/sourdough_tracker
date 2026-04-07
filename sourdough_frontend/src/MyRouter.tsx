import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/App";
import { AdminPage } from "./pages/AdminPage";
import { RecipePage } from "./pages/RecipePage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { useState } from "react";

export function MyRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/admin" element={<AdminPage onLogOut={handleLogout} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}