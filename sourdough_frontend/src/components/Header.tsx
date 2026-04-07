import { IoMenuOutline } from "react-icons/io5"
import "../style/Header.scss"
import { ThemeSwitch } from "./ThemeSwitch"
import { CustomButton } from "./CustomButton"
import { useState } from "react"
import { Link } from "react-router"
export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    function toggleMenu() {
        menuOpen ? setMenuOpen(false) : setMenuOpen(true);
    }

    return (
        <header>
            <nav>
                <ThemeSwitch></ThemeSwitch>
                <h1 className="header-title" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>Sourdough Tracker</h1>
                <CustomButton onButtonClick={toggleMenu} icon={IoMenuOutline} />
            </nav>
            {menuOpen && <div className="menu">
                <Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>Home</Link>
                <Link to="/recipes">Recipes</Link>
                <Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>Sourdough</Link>
            </div>}
        </header >
    )
}