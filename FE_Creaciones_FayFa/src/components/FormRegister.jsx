import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormRegister.css';
import postUsers from '../services/PostRegister';
import Swal from 'sweetalert2';

export default function FormRegister() {
  const [username, setUsername] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const cargar = async (e) => {
    e.preventDefault();
    try {
      await postUsers(username, first_name, last_name, email, password);
      Swal.fire('Se ha registrado exitosamente!');
      navigate('/');
    } catch (error) {
      if (error.message.includes('username')) {
        Swal.fire('Error', 'El nombre de usuario ya está en uso.', 'error');
      } else if (error.message.includes('email')) {
        Swal.fire('Error', 'El correo electrónico ya está en uso.', 'error');
      } else {
        Swal.fire('Error', 'Ocurrió un error al registrarse. Inténtelo nuevamente.', 'error');
      }
    }
  };

  return (
    <div id="register-container">
      <div id="register-card">
        <div id="register-row">
          <div id="register-image">
            <img
              src={"src/assets/img/reg.png"}
              alt="Registro"
              id="register-img"
            />
          </div>
          <div id="register-form-container">
            <form id="register-form" onSubmit={cargar}>
              <h2 id="register-title">Registro de Usuario</h2>
              <p>¡Regístrate ahora y aprovecha todas las funcionalidades de nuestra nueva página web!</p>

              <div className="form-group">
                <input
                  type="text"
                  id="register-username"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="register-firstname"
                  placeholder="Nombre"
                  value={first_name}
                  onChange={(e) => setFirst_name(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="register-lastname"
                  placeholder="Apellido"
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  id="register-email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="register-password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" id="register-button">
                Registrarse
              </button>

              <p id="register-login">
                ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
