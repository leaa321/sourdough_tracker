import { useEffect, useState } from "react";
import type { loaf } from "./models/loaf";
import { getLoafPicture } from "./LoafService";

type LoafItem = {
    loaf: loaf;
    path: string;
}


export function LoafItem({ loaf, path }: LoafItem) {
    const [pic, setPic] = useState<string | any>(null);

    useEffect(() => {
        async function load() {
            const url = await getLoafPicture(path);
            if (url) setPic(url);
        }

        load();
    })

    return (
        <div className="item-card">
            <h2 className="item-title">
                {loaf.title}
            </h2>
            <p className="item-description">
                {loaf.description}
            </p>
            <img src={pic} alt="notworking" />
        </div>
    )
}