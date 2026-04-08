import { useEffect, useState } from "react";
import type { pastry } from "../types/pastry";
import "../style/PastryPage.scss"
import { getPastryPicture } from "../service/PastryService";

export type pastryItem = {
  pastry: pastry;
  path: string;
};

export function PastryItem({ pastry, path }: pastryItem) {
  const [pic, setPic] = useState<string | any>(null);

  useEffect(() => {
    async function load() {
      try {
        const url = await getPastryPicture(path);
        if (url) setPic(url);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  });

  return (
    <div className="item-card">
      <div className="left-side">
        <h3 className="item-title">{pastry.title}</h3>
        <p className="item-description">{pastry.description}</p>
      </div>
      <div className="right-side">
        <img src={pic} alt="notworking" />
      </div>
    </div>
  );
}
