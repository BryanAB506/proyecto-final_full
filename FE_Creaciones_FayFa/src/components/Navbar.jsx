import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

function CustomNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container>
        {/* Logo y Nombre de la Empresa */}
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <img
            src="src\assets\img\logoS.jpg" // Reemplaza con la URL de tu logo
            alt="Logo"
            className="rounded-circle"
            style={{ width: "80px", height: "80px", marginRight: "10px" }}
          />
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Creaciones FayFa
          </span>
        </Navbar.Brand>

        {/* Toggle para dispositivos móviles */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Links principales centrados */}
          <Nav className="mx-auto" style={{ fontSize: "1.2rem" }}>
            <Nav.Link href="/home" className="mx-3">
              Inicio
            </Nav.Link>
            <Nav.Link href="/productos" className="mx-3">
              Productos
            </Nav.Link>
            <Nav.Link href="/contact" className="mx-3">
              Contacto
            </Nav.Link>
            <Nav.Link href="/sobrenosotros" className="mx-3">
              Sobre Nosotros
            </Nav.Link>
          </Nav>

          {/* Perfil y carrito de compras con íconos */}
          <Nav style={{ fontSize: "1.2rem" }}>
            <Nav.Link href="#perfil" className="d-flex align-items-center">
              <i className="bi bi-person-circle" style={{ marginRight: "8px", fontSize: "1.5rem" }}></i>
              Perfil
            </Nav.Link>
            <Nav.Link href="#carrito" className="d-flex align-items-center">
              <i className="bi bi-cart" style={{ marginRight: "8px", fontSize: "1.5rem" }}></i>
              Carrito
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
