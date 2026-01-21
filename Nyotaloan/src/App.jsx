import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoanPackages from './pages/LoanPackages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loan-packages" element={<LoanPackages />} />
      </Routes>
    </Router>
  );
}

export default App;
