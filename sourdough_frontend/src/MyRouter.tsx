import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";


export function MyRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<App />}></Route>
                <Route path="/" element={<App />}></Route>
            </Routes>
        </BrowserRouter>
    )
}