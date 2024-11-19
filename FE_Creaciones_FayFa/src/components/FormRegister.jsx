import React from 'react';
import '../styles/FormLogin.css';

export default function FormRegister() {
  return (
    <div>
      <form className="formLog">
        <p className="form-title">Registra tu cuenta</p>
        <div className="input-containerLog">
          <input
            type="email"
            placeholder="Enter email"
          />
          <span></span>
        </div>
        <div className="input-containerLog">
          <input
            type="password"
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="submit">
          Registrar
        </button>

        <p className="signup-link">
          No account? <a href="#">Sign up</a>
        </p>
      </form>
    </div>
  );
}
