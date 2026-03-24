import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AdminPage } from "./AdminPage";
import { LoginSection } from "./LoginSection";


export function MyRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<LoginSection />}></Route>
                <Route path="/admin" element={<AdminPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}