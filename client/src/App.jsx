import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [gap, setGap] = useState(4); // Tailwind gap scale (1 = 0.25rem)
  const [layoutName, setLayoutName] = useState('');
  const [savedLayouts, setSavedLayouts] = useState([]);

  // Fetch layouts on mount
  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/layouts');
      setSavedLayouts(res.data);
    } catch (err) {
      console.error('Error fetching layouts:', err);
    }
  };

  const handleSave = async () => {
    if (!layoutName) return alert('Please enter a name');
    try {
      await axios.post('http://localhost:5000/api/layouts', {
        name: layoutName,
        config: { rows, cols, gap }
      });
      setLayoutName('');
      fetchLayouts();
      alert('Layout saved!');
    } catch (err) {
      console.error('Error saving layout:', err);
    }
  };

  const loadLayout = (layout) => {
    setRows(layout.config.rows);
    setCols(layout.config.cols);
    setGap(layout.config.gap);
  };

  const generateCode = () => {
    return `<div class="grid grid-cols-${cols} grid-rows-${rows} gap-${gap}">
  {/* Your content here */}
  ${Array(rows * cols).fill(0).map((_, i) => `<div class="bg-blue-200 p-4">${i + 1}</div>`).join('\n  ')}
</div>`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-600">MERN Grid Generator</h1>
        <p className="text-gray-600">Create Tailwind CSS grid layouts easily.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Columns: {cols}</label>
            <input 
              type="range" min="1" max="12" value={cols} 
              onChange={(e) => setCols(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rows: {rows}</label>
            <input 
              type="range" min="1" max="12" value={rows} 
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Gap: {gap}</label>
            <input 
              type="range" min="0" max="12" value={gap} 
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mt-8 pt-4 border-t">
            <h3 className="font-medium mb-2">Save Layout</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Layout Name" 
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <button 
                onClick={handleSave}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t">
            <h3 className="font-medium mb-2">Saved Layouts</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {savedLayouts.map(layout => (
                <li key={layout._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{layout.name}</span>
                  <button 
                    onClick={() => loadLayout(layout)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Load
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Visualizer */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div 
              className={`grid gap-${gap} h-96 w-full bg-gray-100 border-2 border-dashed border-gray-300 p-4 rounded`}
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
              }}
            >
              {Array(rows * cols).fill(0).map((_, i) => (
                <div key={i} className="bg-indigo-200 flex items-center justify-center rounded text-indigo-800 font-bold">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Code Output */}
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-white">Generated Code</h2>
            <pre className="font-mono text-sm">
              {generateCode()}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App