import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormLogin.css';
import postLogin from '../services/PostLogin';
import getAdmin from '../services/GetAdmin';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import FayFaContext from '../Context/FayFaContext';

// Componente principal de formulario de inicio de sesión
export default function FormLogin() {
  // Estados locales para capturar el nombre de usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Contexto personalizado para manejar el estado de inicio de sesión
  const { login } = useContext(FayFaContext);

  // Función para manejar cambios en los inputs
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value); // Actualiza el estado correspondiente
  };

  // Función para manejar el envío del formulario
  const iniciarSesion = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    try {
      // Llama al servicio `postLogin` para validar las credenciales
      const respuesta = await postLogin(username, password);

      // Si la respuesta incluye un token de acceso
      if (respuesta.access) {
        Swal.fire('Login exitoso', '¡Bienvenido!', 'success'); // Muestra un mensaje de éxito

        // Obtiene la lista de usuarios administradores
        const response = await getAdmin();
        
        // Filtra el usuario actual basado en el nombre de usuario
        const users = response.filter((user) => user.username === username);

        // Verifica si el usuario es administrador
        if (users[0].is_staff) {
          login(); // Marca al usuario como autenticado en el contexto
          navigate('/admin'); // Redirige al panel de administración
        } else {
          navigate('/home'); // Redirige al inicio de usuario estándar
        }
      } else {
        throw new Error('Credenciales inválidas'); // Lanza un error si no hay token
      }
    } catch (error) {
      // Maneja errores, mostrando un mensaje y registrando el error
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div id="login-container">
      {/* Contenedor principal del formulario de inicio de sesión */}
      <div id="login-card-wrapper">

        {/* Sección introductoria */}
        <div id="intro-card">
          <h1>¡Bienvenido a nuestra plataforma!</h1>
          <p className="login-text">
            Accede a todas las funcionalidades y disfruta de una experiencia completa.
            Si aún no tienes cuenta, regístrate ahora para comenzar.
          </p>
        </div>

        {/* Sección del formulario de inicio de sesión */}
        <div id="login-card">
          <h2 id="login-title">Inicia Sesión</h2>
          <form onSubmit={iniciarSesion}>
            <div className="form-group">
              {/* Input para capturar el nombre de usuario */}
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
              {/* Input para capturar la contraseña */}
              <input
                type="password"
                id="login-password"
                placeholder="Contraseña"
                value={password}
                onChange={handleInputChange(setPassword)}
                required
              />
            </div>
            {/* Botón para enviar el formulario */}
            <button type="submit" id="login-button">
              Iniciar Sesión
            </button>
            <p id="login-register">
              {/* Enlace para registrarse si el usuario no tiene una cuenta */}
              ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
