import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import GridGenerator from './components/grid/gridGenerator';
import CyberGridGenerator from './components/grid/CyberGridGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grid" element={<GridGenerator />} />
        <Route path="/cyber-grid" element={<CyberGridGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;