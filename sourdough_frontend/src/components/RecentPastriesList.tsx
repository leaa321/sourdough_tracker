import { useEffect, useState } from "react";
import { getPastryPicture, getRecentPastries } from "../service/PastryService";
import type { pastry } from "../types/pastry";
import type { pastryItem } from "./PastryItem";
import "../style/RecentPastriesList.scss"

export function RecentPastriesList() {
    const [pastries, setPastries] = useState<pastry[]>([]);
    const [pastryItems, setPastryItem] = useState<pastryItem[]>([]);

    useEffect(() => {
        getRecentPastries()
            .then(setPastries)
            .catch(console.error);
    }, []);

    useEffect(() => {
        async function loadPictures() {
            try {
                const items = await Promise.all(
                    pastries.map(async (pastry) => {
                        const url = await getPastryPicture(pastry.image_path);
                        return {
                            pastry,
                            path: url
                        };
                    })
                );

                setPastryItem(items);
            } catch (err) {
                console.error(err);
            }
        }

        if (pastries.length > 0) {
            loadPictures();
        } else {
            setPastryItem([]);
        }
    }, [pastries]);

    return (
        <>
            <div className="grid">
                {pastryItems.map((pastry) => (
                    <li key={pastry.pastry.id}>
                        {pastry.pastry.title}
                        <img src={pastry.path} alt="picture of pastry" />
                    </li>
                ))}
            </div>
        </>
    )
}