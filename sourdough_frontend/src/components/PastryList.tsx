import type { pastry } from "../types/pastry";
import { PastryItem } from "./PastryItem";
import "../style/PastryPage.scss"

export type PastryListProps = {
    pastries: pastry[]
}

export function PastryList({ pastries }: PastryListProps) {
    return (
        <ul id="loafes">
            {pastries.map((pastry: pastry) => (
                <li key={pastry.id}>
                    <PastryItem pastry={pastry} path={pastry.image_path}></PastryItem>
                </li>
            ))}
        </ul>
    )
}