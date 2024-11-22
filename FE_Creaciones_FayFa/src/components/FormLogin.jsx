import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../styles/FormLogin.css';
import postLogin from '../services/PostLogin';
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";

export default function FormLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate ();

  
  const cargaUsername = (e) => {
    setUsername(e.target.value);
  };

  const cargaPassword = (e) => {
    setPassword(e.target.value);
  };


  
  const iniciar_sesion = async (e) => {
    e.preventDefault();
    try {
      const Respuesta = await postLogin(username, password)

      if (Respuesta.access) { // Verifica si se recibió un token de acceso
        Swal.fire('Login exitoso', 'Bienvenido!');
        navigate('/home');

      } else {
        
      }
      

    } catch (error) {
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
      console.error('error al registrarse', error);     
    }
  }






  return (
    <div>
      <form className="formLog" onSubmit={iniciar_sesion}>
        <p className="form-title">Sign in to your account</p>
        
        <div className="input-containerLog">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={cargaUsername}
            required
          />
        </div>
        <div className="input-containerLog">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={cargaPassword}
            required
          />
        </div>
        <button type="submit" className="submit">Sign in</button>

        <p className="signup-link">No account? <Link to="/register">Sign up</Link></p>
      </form>
    </div>
  );
}
