import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/App";
import { AdminPage } from "./pages/AdminPage";
import { RecipePage } from "./pages/RecipePage";
import { LoginPage } from "./pages/LoginPage";

export function MyRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/recipes" element={<RecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}
