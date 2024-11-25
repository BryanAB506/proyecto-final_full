import React, { useState,} from 'react';
import { useNavigate } from 'react-router-dom'
import '../styles/FormLogin.css';
import postUsers from '../services/PostRegister';
import Swal from 'sweetalert2'


export default function FormLogin() {
  const [username, setUsername] = useState('')
  const [first_name, setFirst_name] = useState('')
  const [last_name, setLast_name] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate ();





  const cargaUsername = (e) => {
    setUsername(e.target.value);
  };

  const cargafirst_name = (e) => {
    setFirst_name(e.target.value);
  };


  const cargalast_name = (e) => {
    setLast_name(e.target.value);
  };

  const cargaEmail= (e) => {
    setEmail(e.target.value);
  };


  const cargaPassword = (e) => {
    setPassword(e.target.value);
  };


  const cargar = async (e) => {
    e.preventDefault();
    try {
      await postUsers(username, first_name, last_name, email, password)

      Swal.fire("Se ha registrado exitosamente!");
      

      navigate("/login");// redirige al login
    } catch (error) {
      // Maneja errores específicos
      if (error.message.includes("username")) {
        Swal.fire("Error", "El nombre de usuario ya está en uso.", "error");
      } else if (error.message.includes("email")) {
        Swal.fire("Error", "El correo electrónico ya está en uso.", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error al registrarse. Inténtelo nuevamente.", "error");
      }
    }
  }






  return (
    <div>
      <form className="formLog" onSubmit={cargar}>
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
            type="text"
            placeholder="Nombre"
            value={first_name}
            onChange={cargafirst_name}
            required
          />
        </div>

        <div className="input-containerLog">
          <input
            type="text"
            placeholder="Nombre completo"
            value={last_name}
            onChange={cargalast_name}
            required
          />
        </div>

        <div className="input-containerLog">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={cargaEmail}
            required
          />
          <span></span>
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

        <p className="signup-link">
          No account? <a href="#">Sign up</a>
        </p>
      </form>
    </div>
  );
}