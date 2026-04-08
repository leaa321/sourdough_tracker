import { useEffect, useState } from "react";
import { getLoafes } from "../service/LoafService";
import type { loaf } from "../types/loaf";
import { LoafItem } from "./LoafItem";

export function LoafList() {
    const [loafes, setLoafes] = useState<loaf[]>([]);

    useEffect(() => {
        getLoafes().then(setLoafes).catch(console.error);
    }, []);

    return (
        <ul id="loafes">
            {loafes.map((loaf) => (
                <li key={loaf.id}>
                    <LoafItem loaf={loaf} path={loaf.image_path}></LoafItem>
                </li>
            ))}
        </ul>
    )
}