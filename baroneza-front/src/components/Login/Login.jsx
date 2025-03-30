// src/components/login/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Estilos específicos para o componente Login
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// Variável global password, acessível para outros componentes
let password = false;

const Login = () => {
  const [inputPassword, setInputPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-password', { password: inputPassword });
      
      if (response.data.success) {
        setIsPasswordCorrect(true);
        password = true; 
        toast.success('Senha correta!');
      } else {
        setIsPasswordCorrect(false);
        password = false; 
        toast.error('Senha incorreta');
      }
    } catch (error) {
      setIsPasswordCorrect(false);
      password = false;
      toast.error('Erro na verificação da senha');
    }
  };

  const handlePasswordChange = (e) => {
    setInputPassword(e.target.value);
  };

  return (
    <div className="password-lock-container">
      <form onSubmit={handlePasswordSubmit} className="password-form">
        <h5>Esta área é exclusiva para administração, por favor, evite o acesso!</h5>
        <input
          type="password"
          placeholder="Digite a senha"
          value={inputPassword}
          onChange={handlePasswordChange}
          required
          className="password-input"
        />
        <button type="submit" className="submit-button">Verificar</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export { password };
export default Login;
