import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../styles/FormLogin.css';
import postLogin from '../services/PostLogin';
import getAdmin from '../services/GetAdmin';
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
// import { useAuth } from '../Context/AuthContext';
import FayFaContext from '../Context/FayFaContext';

export default function FormLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate ();
  const { login } = useContext(FayFaContext);

  
  const cargaUsername = (e) => {
    setUsername(e.target.value);
  };

  const cargaPassword = (e) => {
    setPassword(e.target.value);
  };


  
  const iniciar_sesion = async (e) => {
    e.preventDefault();

    try {
      // Autenticar al usuario con username y password
      const Respuesta = await postLogin(username, password)

      // Verificar si las credenciales son correctas
      if (Respuesta.access) {
        Swal.fire('Login exitoso', 'Bienvenido!');
        
        // Obtener información del usuario autenticado
        const response = await getAdmin();


        // Verificar si el usuario es staff desde la respuesta de "response" para saber si es true o false
        const users = response.filter(users => users.username == username)
     
        

        if (users[0].is_staff == true) {
          login()
          navigate('/admin')
        }

        if (users[0].is_staff == false) {
          navigate('/home')
        }


    } else {
      throw new Error('Credenciales inválidas');
    }
       
      

    } catch (error) {
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
      console.error('error al inicio de secion', error);     
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
