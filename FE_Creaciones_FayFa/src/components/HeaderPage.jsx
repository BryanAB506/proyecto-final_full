import React from 'react'
import '../styles/HeaderPage.css'
import logoS from '../assets/img/logoS.jpg';
import { Link } from "react-router-dom";



export default function HeaderPage() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <img id='logoEm' src={logoS} alt="" />
          <a href="#home" className="navbar-logo">𝓣𝓾𝓒𝓸𝓶𝓹𝓪ñ𝓲𝓪</a>
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/Main" className='navbar-link'>𝓘𝓷𝓲𝓬𝓲𝓸</Link>
            </li>
            <li className="navbar-item">
              <select name="tipos" id="tiposRo" >
                <option value="">𝓢𝓮𝓻𝓿𝓲𝓬𝓲𝓸𝓼</option>
                <option value="vestidos">Vestidos</option>
                <option value="camisas">Camisas</option>
                <option value="mañanitas">Mañanitas</option>
                <option value="trajes">Trajes</option>
              </select>
            </li>
            <li className="navbar-item">
              <Link to="/SobreNosotros" className='navbar-link'>𝓢𝓸𝓫𝓻𝓮𝓝𝓸𝓼𝓸𝓽𝓻𝓸𝓼</Link>
            </li>
            <li className="navbar-item">
              <Link to="/Contact" className='navbar-link'>𝓒𝓸𝓷𝓽𝓪𝓬𝓽𝓸</Link>
            </li>
          </ul>
          <div className="input-container">
            <input  type="text" name="text" className="input" placeholder="search..." />
            <span className="icon">
              <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M14 5H20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="1" d="M14 8H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="1" d="M22 22L20 20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </span>
          </div>
        </div>
      </nav>
    </div>
  )
}
