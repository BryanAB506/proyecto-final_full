import React from 'react';
import '../styles/FooterPage.css';
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function FooterPage() {
  return (
    <footer className="footer" style={{ borderTop: '5px solid #D4AF37' }}>
      <div className="footer-container">
        {/* Columna 1: Logo y descripción */}
        <div className="footer-column">
          <img src="src/assets/img/logoS.jpg" alt="Logo" className="footer-logo" />
          <p className="footer-text">Creaciones Fa y Fa</p>
          <p className="footer-slogan">Calidad y diseño a tu alcance</p>
        </div>

        {/* Columna 2: Enlaces */}
        <div className="footer-column">
          <h3 className="footer-title">Enlaces</h3>
          <ul className="footer-list">
            <li><Link to="/services" className="footer-link">Servicios</Link></li>
            <li><Link to="/contact" className="footer-link">Contáctanos</Link></li>
            <li><a href="#faqs" className="footer-link">Preguntas Frecuentes</a></li>
            <li><a href="#support" className="footer-link">Soporte</a></li>
          </ul>
        </div>

        {/* Columna 3: Redes sociales */}
        <div className="footer-column">
          <h3 className="footer-title">Síguenos</h3>
          <ul className="footer-social">
            <li><a href="https://www.facebook.com/profile.php?id=100066620144069" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaFacebookF /> Facebook</a></li>
            <li><a href="#instagram" className="footer-social-link"><FaInstagram /> Instagram</a></li>
            <li><a href="#twitter" className="footer-social-link"><FaTwitter /> Twitter</a></li>
            <li><a href="#youtube" className="footer-social-link"><FaYoutube /> YouTube</a></li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="footer-divider" />

      {/* Parte inferior */}
      <div className="footer-bottom">
        <p className="footer-bottom-text">© 2024 Creaciones Fa y Fa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
