import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { RecipePage } from "./pages/RecipePage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { useState } from "react";
import { LayoutPage } from "./pages/LayoutPage";
import Home from "./pages/Home";
import { PastryPage } from "./pages/PastryPage";

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
        <Route path="/" element={<LayoutPage />} >
          <Route path="" element={<Home />}></Route>
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/pastries" element={<PastryPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/admin" element={<AdminPage onLogOut={handleLogout} />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}