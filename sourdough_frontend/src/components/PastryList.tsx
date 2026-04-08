import { useEffect, useState } from "react";
import type { pastry } from "../types/pastry";
import { getPastries } from "../service/PastryService";
import { PastryItem } from "./PastryItem";
import "../style/PastryPage.scss"

export function PastryList() {
    const [loafes, setLoafes] = useState<pastry[]>([]);

    useEffect(() => {
        getPastries().then(setLoafes).catch(console.error);
    }, []);

    return (
        <ul id="loafes">
            {loafes.map((pastry) => (
                <li key={pastry.id}>
                    <PastryItem pastry={pastry} path={pastry.image_path}></PastryItem>
                </li>
            ))}
        </ul>
    )
}