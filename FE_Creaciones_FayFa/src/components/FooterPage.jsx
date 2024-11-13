import React from 'react'
import '../styles/FooterPage.css'
import { Link } from "react-router-dom";




export default function FooterPage() {
 
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">Sobre Nosotros</h3>
          <p className="footer-text">Somos una empresa dedicada a ofrecer servicios de alta calidad.</p>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Enlaces</h3>
          <div className="footer-links">
            <a href="#privacy" className="footer-link">Política de Privacidad</a>
            <a href="#terms" className="footer-link">Términos de Servicio</a>        
              <Link to="/Contact" className="footer-link">Contacto</Link>
          </div>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Síguenos</h3>
            <div>
                <button  className="btn">Cerrar Sesión</button>
            </div>
          <div className="footer-links">
            <a href="https://www.facebook.com/profile.php?id=100066620144069&mibextid=ZbWKwL" className="footer-link">Facebook</a>

            <a href="#instagram" className="footer-link">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-bottom-text">© 2024 Creaciones Fa y Fa. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
