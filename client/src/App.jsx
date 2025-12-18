import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GridGenerator from './components/grid/gridGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grid" element={<GridGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;