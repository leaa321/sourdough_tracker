import './style/App.scss'
import { useEffect, useState } from 'react';
import type { loaf } from './models/loaf';
import { LoafItem } from './LoafItem';
import { getLoafes } from './service/LoafService';
import { Link } from 'react-router-dom';

function App() {
  const [loafes, setLoafes] = useState<loaf[]>([]);

  useEffect(() => {
    getLoafes()
      .then(setLoafes)
      .catch(console.error);
  }, [])

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
    </>
  )
}

export default App
