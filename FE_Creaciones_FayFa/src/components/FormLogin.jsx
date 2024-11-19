import React from 'react';
import '../styles/FormLogin.css';

export default function FormLogin() {
  return (
    <div>
      <form className="formLog">
        <p className="form-title">Sign in to your account</p>
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
          Sign in
        </button>

        <p className="signup-link">
          No account? <a href="#">Sign up</a>
        </p>
      </form>
    </div>
  );
}
