import "../style/App.scss";
import { useEffect, useState } from "react";
import type { loaf } from "../types/loaf";
import { getLoafes } from "../service/LoafService";
import { Link } from "react-router-dom";
import { LoafItem } from "../components/LoafItem";

function App() {
  const [loafes, setLoafes] = useState<loaf[]>([]);

  useEffect(() => {
    getLoafes().then(setLoafes).catch(console.error);
  }, []);

  return (
    <>
      <ul>
        {loafes.map((loaf) => (
          <li key={loaf.id}>
            <LoafItem loaf={loaf} path={loaf.image_path}></LoafItem>
          </li>
        ))}
      </ul>

      <Link to="/login">Login</Link>
      <Link to="/recipes">Recipes</Link>
    </>
  );
}

export default App;
