import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Importar el hook de navegación

export default function LoginPrueb() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); 
    navigate('/admin'); 
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
};
