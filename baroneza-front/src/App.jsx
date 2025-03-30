import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import Carrossel from './components/Carousel/Carousel';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lock from './components/Lock/Lock';  // Importa o componente Lock (botão do cadeado)
import Login from './components/Login/Login';  // Importa o componente Login (formulário)

import './App.css';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      <Header />
      {windowWidth > 450 && <Carrossel />}
      <Router>
      <Routes>
        {/* Rota para o componente Lock */}
        <Route path="/" element={<Lock />} />

        {/* Rota para o componente Login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

