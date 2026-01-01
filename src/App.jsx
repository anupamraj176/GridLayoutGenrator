import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import Hero from './components/home/Hero';
import GridGenerator from './components/grid/GridGenerator';
import CyberGridGenerator from './components/grid/CyberGridGenerator';
import FluidMeshGenerator from './components/grid/FluidMeshGenerator';
import ClassicGridGenerator from './components/grid/ClassicGridGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Hero />} />
          <Route path="/grid" element={<GridGenerator />} />
          <Route path="/cyber-grid" element={<CyberGridGenerator />} />
          <Route path="/fluid-mesh" element={<FluidMeshGenerator />} />
          <Route path="/classic-grid" element={<ClassicGridGenerator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;