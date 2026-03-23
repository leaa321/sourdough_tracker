import './App.css'
import { getLoafes } from './LoafService';
import { useEffect, useState } from 'react';
import type { loaf } from './models/loaf';
import { LoafItem } from './LoafItem';

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
            <LoafItem loaf={loaf}></LoafItem>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
