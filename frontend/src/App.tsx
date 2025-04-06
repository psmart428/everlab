import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/data`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Data from backend:</h1>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
