import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Login/Login';
import Cadastro from './components/Cadastro/Cadastro'
import Casas from './components/Casas/Casas'
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
         <Route path="/cadastro" element={<Cadastro />} />
         <Route path="/casas" element={<Casas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;