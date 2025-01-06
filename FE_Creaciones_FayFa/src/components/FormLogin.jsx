import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormLogin.css';
import postLogin from '../services/PostLogin';
import getAdmin from '../services/GetAdmin';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import FayFaContext from '../Context/FayFaContext';

export default function FormLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(FayFaContext);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await postLogin(username, password);
      if (respuesta.access) {
        Swal.fire('Login exitoso', '¡Bienvenido!', 'success');
        const response = await getAdmin();
        const users = response.filter((user) => user.username === username);
        if (users[0].is_staff) {
          login();
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div id="login-container">
      <div id="login-card-wrapper">
        {/* Introductory Section */}
        <div id="intro-card">
          <h1>¡Bienvenido a nuestra plataforma!</h1>
          <p className="login-text">
            Accede a todas las funcionalidades y disfruta de una experiencia completa.
            Si aún no tienes cuenta, regístrate ahora para comenzar.
          </p>
        </div>
        
        {/* Login Section */}
        <div id="login-card">
          <h2 id="login-title">Inicia Sesión</h2>
          <form onSubmit={iniciarSesion}>
            <div className="form-group">
              <input
                type="text"
                id="login-username"
                placeholder="Usuario"
                value={username}
                onChange={handleInputChange(setUsername)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="login-password"
                placeholder="Contraseña"
                value={password}
                onChange={handleInputChange(setPassword)}
                required
              />
            </div>
            <button type="submit" id="login-button">
              Iniciar Sesión
            </button>
            <p id="login-register">
              ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
  
}
