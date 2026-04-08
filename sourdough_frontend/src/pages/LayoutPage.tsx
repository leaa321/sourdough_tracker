import { Link, Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function LayoutPage() {
    return (
        <>
            <Header></Header>
            <Outlet />
            <footer>© {new Date().getFullYear()} Ashley Drewes.
                <Link to="/login">Login</Link>
            </footer>
        </>)
}