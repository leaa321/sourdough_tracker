import type { loaf } from "./models/loaf";

type LoafItem = {
    loaf: loaf;
}

export function LoafItem({ loaf }: LoafItem) {
    return (
        <div className="item-card">
            <h2 className="item-title">
                {loaf.title}
            </h2>
        </div>
    )
}