import { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { CustomButton } from "./CustomButton";

export function ThemeSwitch() {
    const [theme, setTheme] = useState(() => {
        const savedMode = localStorage.getItem('mode');
        return savedMode ? savedMode : 'dark';
    });

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        localStorage.setItem('mode', theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <>
            <CustomButton onButtonClick={toggleTheme} icon={theme === "light" ? IoMoonOutline : IoSunnyOutline}></CustomButton>
        </>
    )
}