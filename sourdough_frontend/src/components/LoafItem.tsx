import { useEffect, useState } from "react";
import type { loaf } from "../types/loaf";
import { getLoafPicture } from "../service/LoafService";
import "../style/loafitem.scss";

type LoafItem = {
  loaf: loaf;
  path: string;
};

export function LoafItem({ loaf, path }: LoafItem) {
  const [pic, setPic] = useState<string | any>(null);

  useEffect(() => {
    async function load() {
      try {
        const url = await getLoafPicture(path);
        if (url) setPic(url);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  });

  return (
    <div className="item-card">
      <h2 className="item-title">{loaf.title}</h2>
      <p className="item-description">{loaf.description}</p>
      <img src={pic} alt="notworking" />
    </div>
  );
}
