// src/components/lock/Lock.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Lock.css';  // Estilos específicos para o componente Lock

const Lock = () => {
  const navigate = useNavigate();

  const handleLockClick = () => {
    // Redireciona para a página de login
    navigate('/login');
  };

  return (
    <div className="lock-wrapper">
      <button onClick={handleLockClick} className="lock-button">
        <FontAwesomeIcon icon={faLock} />
      </button>
    </div>
  );
};

export default Lock;
